import { uniqueId } from '../../common/index';
import G6, { Shape } from '@antv/g6';
const MIN_ARROW_SIZE = 3;

export default class Edge {
  init() {
    const dashArray = [
      [0, 1],
      [0, 2],
      [1, 2],
      [0, 1, 1, 2],
      [0, 2, 1, 2],
      [1, 2, 1, 2],
      [2, 2, 1, 2],
      [3, 2, 1, 2],
      [4, 2, 1, 2]
    ];

    const lineDash = [4, 2, 1, 2];
    const interval = 9;
    G6.registerEdge('customEdge', {
      draw(cfg, group) {
        let sourceNode, targetNode, start, end;
        if (typeof (cfg.source) === 'string') {
          cfg.source = cfg.sourceNode;
        }
        cfg.start = cfg.start || {x: 0, y: 17};
        cfg.end = cfg.end || {x: 0, y: -17};
        if (!cfg.source.x) {
          sourceNode = cfg.source.getModel();
          start = { x: sourceNode.x + cfg.start.x, y: sourceNode.y + cfg.start.y };
        } else {
          start = cfg.source;
        }
        if (typeof (cfg.target) === 'string') {
          cfg.target = cfg.targetNode;
        }
        if (!cfg.target.x) {
          targetNode = cfg.target.getModel();
          end = { x: targetNode.x + cfg.end.x, y: targetNode.y +  cfg.end.y };
        } else {
          end = cfg.target;
        }
        let path = [];
        let hgap = Math.abs(end.x - start.x);
        if (end.x > start.x) {
          path = [
            ['M', start.x, start.y],
            [
              'C',
              start.x,
              start.y + hgap / (hgap / 50),
              end.x,
              end.y - hgap / (hgap / 50),
              end.x,
              end.y - 4
            ],
            [
              'L',
              end.x,
              end.y
            ]
          ];
        } else {
          path = [
            ['M', start.x, start.y],
            [
              'C',
              start.x,
              start.y + hgap / (hgap / 50),
              end.x,
              end.y - hgap / (hgap / 50),
              end.x,
              end.y - 4
            ],
            [
              'L',
              end.x,
              end.y
            ]
          ]
        }
        // path = [
        //   ['M', start.x, start.y],
        //   ['L', end.x / 3 + (2 / 3) * start.x, start.y], // 三分之一处
        //   ['L', end.x / 3 + (2 / 3) * start.x, end.y], // 三分之二处
        //   ['L', end.x, end.y],
        // ];
        if (sourceNode.id === targetNode.id) { // 连接到自身
          if (start.x > end.x && start.y > end.y && sourceNode.y < start.y) { // 底->左
            path = [
              ['M', start.x, start.y],
              ['L', start.x, start.y + 15],
              ['L', end.x - 15, start.y + 15],
              ['L', end.x - 15, end.y],
              ['L', end.x, end.y]
            ];
          }
          if (start.x > end.x && start.y > end.y && sourceNode.y > end.y) { // 右->上
            path = [
              ['M', start.x, start.y],
              ['L', start.x + 15, start.y],
              ['L', start.x + 15, end.y - 15],
              ['L', end.x, end.y - 15],
              ['L', end.x, end.y]
            ];
          }
        }
        let lineWidth = 1;
        lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
        const width = lineWidth * 10 / 3;
        const halfHeight = lineWidth * 4 / 3;
        const endArrowPath = `M 0,0 L ${width},${halfHeight} L ${width},${-halfHeight} Z`;
        const mainId = 'edge' + uniqueId();
        const keyShape = group.addShape('path', {
          attrs: {
            id: mainId,
            path: path,
            stroke: '#b8c3ce',
            lineAppendWidth: 10,
            endArrow: {
              path: endArrowPath,
              fill: '#b8c3ce'
            }
          }
        });
        const shape = group.get('children')[0];
        // the start position of the edge's path
        const startPoint = shape.getPoint(0);

        console.log(cfg);
        // add red circle shape
        group.addShape('circle', {
          attrs: {
            parent: mainId,
            x: startPoint.x + 15,
            y: startPoint.y + 15,
            fill: cfg.lineCircle.background,
            r: 10,
            opacity: 1,
            stroke: cfg.lineCircle.border,
          },
          name: 'circle-shape',
        });
        group.addShape('text', {
          attrs: {
            id: 'label' + uniqueId(),
            parent: mainId,
            x: startPoint.x + 15,
            y: startPoint.y + 15,
            textAlign: 'center',
            textBaseline: 'middle',
            text: cfg.lineCircle.text,
            fill: cfg.lineCircle.border
          }
        });
        return keyShape;
      },
      afterDraw(cfg, group) {
        if (cfg.sourceNode.getModel().isDoingStart && cfg.sourceNode.getModel().isDoingEnd) {
          const shape = group.get('children')[0];
          const length = shape.getTotalLength(); // G 增加了 totalLength 的接口
          let totalArray = [];
          for (let i = 0; i < length; i += interval) {
            totalArray = totalArray.concat(lineDash);
          }
          let index = 0;
          shape.animate({
            onFrame() {
              const cfg = {
                lineDash: dashArray[index].concat(totalArray)
              };
              index = (index + 1) % interval;
              return cfg;
            },
            repeat: true
          }, 3000);
        }
      },
      // update(cfg, item) {
      //   console.log(cfg);
      //   console.log(item);
      // },
      setState(name, value, item) {
        const group = item.getContainer();
        const shape = group.get('children')[0];
        const selectStyles = () => {
          shape.attr('stroke', '#6ab7ff');
        };
        const unSelectStyles = () => {
          shape.attr('stroke', '#b8c3ce');
        };
        const showCircle = () => {
          shape.attr('opacity', 1);
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
          case 'showCircle':
            showCircle();
        }
      }
    });
    G6.registerEdge('link-edge', {
      draw(cfg, group) {
        let sourceNode, targetNode, start, end;
        if (typeof (cfg.source) === 'string') {
          cfg.source = cfg.sourceNode;
        }
        if (typeof (cfg.target) === 'string') {
          cfg.target = cfg.targetNode;
        }
        if (!cfg.source.x) {
          sourceNode = cfg.source.getModel();
          start = { x: sourceNode.x + cfg.start.x, y: sourceNode.y + cfg.start.y };
        } else {
          start = cfg.source;
        }
        if (!cfg.target.x) {
          targetNode = cfg.target.getModel();
          end = { x: targetNode.x + cfg.end.x, y: targetNode.y + cfg.end.y };
        } else {
          end = cfg.target;
        }
        let path = [];
        path = [
          ['M', start.x, start.y],
          ['L', end.x, end.y]
        ];
        const keyShape = group.addShape('path', {
          attrs: {
            id: 'edge' + uniqueId(),
            path: path,
            stroke: '#1890FF',
            strokeOpacity: 0.9,
            lineDash: [5, 5]
          }
        });
        return keyShape
      },
    });
  }
}

