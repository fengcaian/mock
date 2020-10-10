import { uniqueId } from '../../common/index';
import G6, { Shape } from '@antv/g6';

export default class CustomNode {
  init() {
    G6.registerNode('customNode', {
      draw(cfg, group) {
        console.log('draw');
        let { size } = cfg;
        if (!size) {
          size = [170, 34];
        }
        const width = parseInt(size[0]);
        const height = parseInt(size[1]);
        const color = cfg.color;
        const offsetX = -width / 2;
        const offsetY = -height / 2;
        const mainId = 'rect' + uniqueId();
        const shape = group.addShape('rect', {
          attrs: {
            id: mainId,
            x: offsetX,
            y: offsetY,
            width: width,
            height: height,
            stroke: color,
            fill: '#fff', //此处必须有fill 不然不能触发事件
            radius: 4
          }
        });
        group.addShape('circle', {
          attrs: {
            id: 'circle' + uniqueId(),
            x: offsetX + width - 10,
            y: offsetY + 10,
            r: 8,
            fill: '#e6a23c',
            stroke: '#e6a23c',
            opacity: 1,
            parent: mainId
          }
        });
        if (cfg.innerCycleLabel) {
          group.addShape('text', {
            attrs: {
              id: 'label' + uniqueId(),
              x: offsetX + width - 10,
              y: offsetY + 10,
              textAlign: 'center',
              textBaseline: 'middle',
              text: cfg.innerCycleLabel,
              parent: mainId,
              fill: color
            }
          });
        }
        if (cfg.label) {
          group.addShape('text', {
            attrs: {
              id: 'label' + uniqueId(),
              x: offsetX + width / 2,
              y: offsetY + height / 2,
              textAlign: 'center',
              textBaseline: 'middle',
              text: ((label) => {
                let result = '';
                while (label.length > 6) {
                  result = result.concat(label.slice(0, 6)).concat('\n');
                  label = label.slice(6, label.length);
                }
                result = result.concat(label);
                return result;
              })(cfg.label),
              parent: mainId,
              fill: color
            }
          });
        }
        let { inPoints, outPoints } = cfg;
        outPoints = JSON.parse(JSON.stringify(outPoints));
        if (inPoints) {
          for (let i = 0; i < inPoints.length; i += 1) {
            let x, y = 0;
            //0为顶 1为底
            x = width * inPoints[i][0];
            y = height * inPoints[i][1];
            const samePosIndex = outPoints.findIndex(item => item[1] === inPoints[i][1] && item[0] === inPoints[i][0]);
            if (samePosIndex !== -1) { // 存在in和out重合的情况,进出双向锚点
              _drawAnchor(group,{
                isBothWayAnchor: true,
                x: width * inPoints[i][0] + offsetX,
                y: height * inPoints[i][1] + offsetY,
                dIn: _calculateAnchorDir('in', inPoints[i]),
                dOut: _calculateAnchorDir('out', inPoints[i]),
              }, {
                isBothWayAnchorOut: true,
                x: width * inPoints[i][0] + offsetX,
                y: height * inPoints[i][1] + offsetY,
                dIn: _calculateAnchorDir('in', inPoints[i]),
                dOut: _calculateAnchorDir('out', inPoints[i]),
              });
              outPoints.splice(samePosIndex, 1);
            } else { // 进锚点
              _drawAnchor(group,{
                isInAnchor: true,
                x: width * inPoints[i][0] + offsetX,
                y: height * inPoints[i][1] + offsetY,
                dIn: _calculateAnchorDir('in', inPoints[i]),
              }, {
                isInAnchorOut: true,
                x: width * inPoints[i][0] + offsetX,
                y: height * inPoints[i][1] + offsetY,
                dIn: _calculateAnchorDir('in', inPoints[i]),
              });
            }
          }
        }
        if (outPoints) { // 出锚点
          for (let i = 0; i < outPoints.length; i += 1) {
            let x, y = 0;
            // 0为顶 1为底
            x = width * outPoints[i][0];
            y = height * outPoints[i][1];
            _drawAnchor(group, {
              isOutAnchor: true,
              x: width * outPoints[i][0] + offsetX,
              y: height * outPoints[i][1] + offsetY,
              dOut: _calculateAnchorDir('out', inPoints[i]),
            }, {
              isOutAnchorOut: true,
              x: width * inPoints[i][0] + offsetX,
              y: height * inPoints[i][1] + offsetY,
              dOut: _calculateAnchorDir('out', inPoints[i]),
            });
          }
        }
        function _drawAnchor(group, _anchorAttrs, _anchorOutAttrs) {
          const id = 'small-anchor-' + uniqueId();
          group.addShape('circle', {
            attrs: {
              ..._anchorOutAttrs,
              id: 'big-anchor-' + uniqueId(),
              parent: id,
              r: 10,
              fill: color,
              opacity: 0 //默認0 需要時改成0.3
            },
            name: 'big-anchor'
          });
          group.addShape('circle', {
            attrs: {
              ..._anchorAttrs,
              id: id,
              r: 3,
              fill: '#fff',
              stroke: color,
              opacity: 0
            },
            name: 'small-anchor'
          });
        }
        function _calculateAnchorDir(type, point) { // 计算接入接出点的方向；params: 接入/接出,点坐标
          // 预定义：up,right,down,left分别为up=1，right=2，down=-1，left=-2以方便计算
          if ((point[0] + point[1]) % 1 === 0) {// 判断是否是在顶点上
            if (point[0] === 0 && point[1] === 0) {
              return type === 'in' ? [2, -1] : [-2, 1];
            } else if (point[0] === 1 && point[1] === 1) {
              return type === 'in' ? [-2, 1] : [2, -1];
            } else if (point[0] === 0 && point[1] === 1) {
              return type === 'in' ? [2, 1] : [-2, -1];
            } else if (point[0] === 1 && point[1] === 0) {
              return type === 'in' ? [-2, -1] : [2, 1];
            } else {
              return [1, 2, -1, -2];
            }
          } else { // 判断是在棱上
            if (point[0] === 0) { // 左棱
              return type === 'in' ? [2] : [-2];
            } else if (point[0] === 1) { // 右棱
              return type === 'in' ? [-2] : [2];
            } else if (point[1] === 0) { // 上棱
              return type === 'in' ? [-1] : [1];
            } else if (point[1] === 1) { // 下棱
              return type === 'in' ? [1] : [-1];
            } else {
              return [1, 2, -1, -2];
            }
          }
        }
        return shape;
      },
      setState(name, value, item) {
        console.log('setstate');
        const group = item.getContainer();
        const shape = group.get('children')[0]; // 顺序根据 draw 时确定
        const children = group.findAll(g => {
          return g.attrs.parent === shape.attrs.id;
        });
        const circles = group.findAll(circle => {
          return circle.attrs.isInAnchor || circle.attrs.isOutAnchor || circle.attrs.isBothWayAnchor;
        });
        const selectStyles = () => {
          shape.attr('fill', '#f3f9ff');
          shape.attr('stroke', '#6ab7ff');
          shape.attr('cursor', 'move');
          children.forEach(child => {
            child.attr('cursor', 'move');
          });
          circles.forEach(circle => {
            circle.attr('opacity', 1);
          })
        };
        const unSelectStyles = () => {
          shape.attr('fill', '#fff');
          shape.attr('stroke', '#1890ff');
          circles.forEach(circle => {
            circle.attr('opacity', 0);
          })
        };
        switch (name) {
          case 'selected':
          case 'hover':
            if (value) {
              selectStyles();
            } else {
              unSelectStyles();
            }
            break;
        }
      },
    });
  }
}