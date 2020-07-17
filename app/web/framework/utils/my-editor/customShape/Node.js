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
        if (cfg.inPoints) {
          for (let i = 0; i < cfg.inPoints.length; i += 1) {
            let x, y = 0;
            //0为顶 1为底
            if (cfg.inPoints[i][0] === 0) {
              y = 0;
            } else {
              y = height;
            }
            x = width * cfg.inPoints[i][1];
            const id = 'circle' + uniqueId()
            group.addShape('circle', {
              attrs: {
                id: 'circle' + uniqueId(),
                parent: id,
                x: x + offsetX,
                y: y + offsetY,
                r: 10,
                isInPointOut: true,
                fill: color,
                opacity: 0
              }
            });
            group.addShape('circle', {
              attrs: {
                id: id,
                x: x + offsetX,
                y: y + offsetY,
                r: 3,
                isInPoint: true,
                fill: '#fff',
                stroke: color,
                opacity: 0
              }
            });
          }
        }
        if (cfg.outPoints) {
          for (let i = 0; i < cfg.outPoints.length; i += 1) {
            let x, y = 0;
            //0为顶 1为底
            if (cfg.outPoints[i][0] === 0) {
              y = 0;
            } else {
              y = height;
            }
            x = width * cfg.outPoints[i][1];
            const id = 'circle' + uniqueId()
            group.addShape('circle', {
              attrs: {
                id: 'circle' + uniqueId(),
                parent: id,
                x: x + offsetX,
                y: y + offsetY,
                r: 10,
                isOutPointOut: true,
                fill: color,
                opacity: 0 //默認0 需要時改成0.3
              }
            });
            group.addShape('circle', {
              attrs: {
                id: id,
                x: x + offsetX,
                y: y + offsetY,
                r: 3,
                isOutPoint: true,
                fill: '#fff',
                stroke: color,
                opacity: 0
              }
            });
          }
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
          return circle.attrs.isInPoint || circle.attrs.isOutPoint;
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