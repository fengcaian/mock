import { uniqueId } from '../../common/index';
import G6, { Shape } from '@antv/g6';

export default class CustomNode {
  init() {
    G6.registerNode('customNode', {
      draw(cfg, group) {
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
              text: cfg.label,
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
            x = width * inPoints[i][1];
            y = height * inPoints[i][0];
            const samePosIndex = outPoints.findIndex(item => item[1] === inPoints[i][1] && item[0] === inPoints[i][0]);
            if (samePosIndex !== -1) { // 存在in和out重合的情况,进出双向锚点
              _drawAnchor(group,{
                isBothWayAnchor: true,
                x: width * inPoints[i][1] + offsetX,
                y: height * inPoints[i][0] + offsetY,
              }, {
                isBothWayAnchorOut: true,
                x: width * inPoints[i][1] + offsetX,
                y: height * inPoints[i][0] + offsetY,
              });
              outPoints.splice(samePosIndex, 1);
            } else { // 进锚点
              _drawAnchor(group,{
                isInAnchor: true,
                x: width * inPoints[i][1] + offsetX,
                y: height * inPoints[i][0] + offsetY,
              }, {
                isInAnchorOut: true,
                x: width * inPoints[i][1] + offsetX,
                y: height * inPoints[i][0] + offsetY,
              });
            }
          }
        }
        if (outPoints) { // 出锚点
          for (let i = 0; i < outPoints.length; i += 1) {
            let x, y = 0;
            // 0为顶 1为底
            x = width * outPoints[i][1];
            y = height * outPoints[i][0];
            _drawAnchor(group, {
              isOutAnchor: true,
              x: width * outPoints[i][1] + offsetX,
              y: height * outPoints[i][0] + offsetY,
            }, {
              isOutAnchorOut: true,
              x: width * inPoints[i][1] + offsetX,
              y: height * inPoints[i][0] + offsetY,
            });
          }
        }
        function _drawAnchor(group, _anchorAttrs, _anchorOutAttrs) {
          const id = 'circle' + uniqueId();
          group.addShape('circle', {
            attrs: {
              ..._anchorOutAttrs,
              id: 'circle' + uniqueId(),
              parent: id,
              r: 10,
              fill: color,
              opacity: 0 //默認0 需要時改成0.3
            }
          });
          group.addShape('circle', {
            attrs: {
              ..._anchorAttrs,
              id: id,
              r: 3,
              fill: '#fff',
              stroke: color,
              opacity: 0
            }
          });
        }
        return shape;
      },
      setState(name, value, item) {
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
          console.log(children.length);
          children.forEach(child => {
            console.log(1);
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