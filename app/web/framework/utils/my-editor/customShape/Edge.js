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
        const direction = _judgeLineDirection(start, end);
        const pathWidth = end.x - start.x;
        const pathHeight = end.y - start.y;
        const radius = 5;
        switch (direction) {
          case 'left':
            if (pathHeight > 0) {
              path = path = [
                ['M', start.x, start.y],
                ['L', start.x + (pathWidth / 2) + radius, start.y],
                ['Q', start.x + (pathWidth / 2), start.y, start.x + (pathWidth / 2), start.y + radius],
                ['L', start.x + (pathWidth / 2), end.y - radius],
                ['Q', start.x + (pathWidth / 2), end.y, start.x + (pathWidth / 2) - radius, end.y],
                ['L', end.x, end.y]
              ];
            } else if (pathHeight < 0) {
              path = path = [
                ['M', start.x, start.y],
                ['L', start.x + (pathWidth / 2) + radius, start.y],
                ['Q', start.x + (pathWidth / 2), start.y, start.x + (pathWidth / 2), start.y - radius],
                ['L', start.x + (pathWidth / 2), end.y + radius],
                ['Q', start.x + (pathWidth / 2), end.y, start.x + (pathWidth / 2) - radius, end.y],
                ['L', end.x, end.y]
              ];
            } else {
              path = path = [
                ['M', start.x, start.y],
                ['L', end.x, end.y]
              ];
            }
            break;
          case 'right':
            if (pathHeight > 0) {
              path = [
                ['M', start.x, start.y],
                ['L', start.x + (pathWidth / 2) - radius, start.y],
                ['Q', start.x + (pathWidth / 2), start.y, start.x + (pathWidth / 2), start.y + radius],
                ['L', start.x + (pathWidth / 2), end.y - radius],
                ['Q', start.x + (pathWidth / 2), end.y, start.x + (pathWidth / 2) + radius, end.y],
                ['L', end.x, end.y]
              ];
            } else if (pathHeight < 0) {
              path = [
                ['M', start.x, start.y],
                ['L', start.x + (pathWidth / 2) - radius, start.y],
                ['Q', start.x + (pathWidth / 2), start.y, start.x + (pathWidth / 2), start.y - radius],
                ['L', start.x + (pathWidth / 2), end.y + radius],
                ['Q', start.x + (pathWidth / 2), end.y, start.x + (pathWidth / 2) + radius, end.y],
                ['L', end.x, end.y]
              ];
            } else {
              path = path = [
                ['M', start.x, start.y],
                ['L', end.x, end.y]
              ];
            }
            break;
          case 'up':
            if (pathWidth > 0) {
              path = [
                ['M', start.x, start.y],
                ['L', start.x, start.y + (pathHeight / 2) + radius],
                ['Q', start.x, start.y + (pathHeight / 2), start.x + radius, start.y + (pathHeight / 2)],
                ['L', end.x - radius, start.y + (pathHeight / 2)],
                ['Q', end.x, start.y + (pathHeight / 2), end.x, start.y + (pathHeight / 2) - radius],
                ['L', end.x, end.y]
              ];
            } else if (pathWidth < 0) {
              path = [
                ['M', start.x, start.y],
                ['L', start.x, start.y + (pathHeight / 2) + radius],
                ['Q', start.x, start.y + (pathHeight / 2), start.x - radius, start.y + (pathHeight / 2)],
                ['L', end.x + radius, start.y + (pathHeight / 2)],
                ['Q', end.x, start.y + (pathHeight / 2), end.x, start.y + (pathHeight / 2) - radius],
                ['L', end.x, end.y]
              ];
            } else {
              path = path = [
                ['M', start.x, start.y],
                ['L', end.x, end.y]
              ];
            }
            break;
          case 'down':
            if (pathWidth > 0) {
              path = [
                ['M', start.x, start.y],
                ['L', start.x, start.y + (pathHeight / 2) -radius],
                ['Q', start.x, start.y + (pathHeight / 2), start.x + radius, start.y + (pathHeight / 2)],
                ['L', end.x - radius, start.y + (pathHeight / 2)],
                ['Q', end.x, start.y + (pathHeight / 2), end.x, start.y + (pathHeight / 2) + radius],
                ['L', end.x, end.y]
              ];
            } else if (pathWidth < 0) {
              path = [
                ['M', start.x, start.y],
                ['L', start.x, start.y + (pathHeight / 2) -radius],
                ['Q', start.x, start.y + (pathHeight / 2), start.x - radius, start.y + (pathHeight / 2)],
                ['L', end.x + radius, start.y + (pathHeight / 2)],
                ['Q', end.x, start.y + (pathHeight / 2), end.x, start.y + (pathHeight / 2) + radius],
                ['L', end.x, end.y]
              ];
            } else {
              path = path = [
                ['M', start.x, start.y],
                ['L', end.x, end.y]
              ];
            }
            break;
        }
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
            x: startPoint.x + (end.x - startPoint.x)/2,
            y: startPoint.y + (end.y - startPoint.y)/2,
            fill: cfg.lineCircle.background,
            r: 10,
            opacity: cfg.lineCircle.isShow ? 1 : 0,
            stroke: cfg.lineCircle.border,
          },
          name: 'circle-shape',
        });
        group.addShape('text', {
          attrs: {
            id: 'label' + uniqueId(),
            parent: mainId,
            x: startPoint.x + (end.x - startPoint.x)/2,
            y: startPoint.y + (end.y - startPoint.y)/2,
            textAlign: 'center',
            textBaseline: 'middle',
            text: cfg.lineCircle.text,
            fill: cfg.lineCircle.border,
            opacity: cfg.lineCircle.isShow ? 1 : 0,
          }
        });
        console.log(path);
        const edgeControlPoint = _getEdgeControlPoint(JSON.parse(JSON.stringify(path)));
        console.log(edgeControlPoint);
        edgeControlPoint.forEach((item) => {
          group.addShape('circle', {
            attrs: {
              parent: mainId,
              x: item.x,
              y: item.y,
              fill: '#29B6F2',
              r: 4,
              opacity: 1,
              stroke: '#29B6F2',
            },
            name: 'circle-shape',
          });
        });
        function _judgeLineDirection(p1 = {x: 0, y: 0}, p2 = {x: 0, y: 0}) {
          const width = p2.x - p1.x;
          const height = p2.y - p1.y;
          console.log(`width=${width}`,`height=${height}`);
          let direction = '';
          if (width === 0 && height > 0) {
            direction = 'down';
          } else if (width === 0 && height < 0) {
            direction = 'up';
          } else if (height === 0 && width > 0) {
            direction = 'right';
          } else if (height === 0 && width < 0) {
            direction = 'left';
          } else if (width > 0 && height < 0) { // 第一象限
            if (width >= Math.abs(height)) {
              direction = 'right';
            } else {
              direction = 'up';
            }
          } else if (width < 0 && height < 0) { // 第二象限
            if (Math.abs(width) >= Math.abs(height)) {
              direction = 'left';
            } else {
              direction = 'up';
            }
          } else if (width < 0 && height > 0) { // 第三象限
            if (width >= height) {
              direction = 'left';
            } else {
              direction = 'down';
            }
          } else { // 第四象限
            if (width >= Math.abs(height)) {
              direction = 'right';
            } else {
              direction = 'down';
            }
          }
          return direction;
        }
        function _getEdgeControlPoint(pathArray) { // 三个线段M->Q,Q->Q,Q->L
          const list = [];
          if (Array.isArray(pathArray)) {
            pathArray.forEach((item) => {
              item.shift();
              while (item.length > 1) {
                list.push([item.shift(), item.shift()]);
              }
            });
          }
          const lineArray = [];
          let line = {
            start: null,
            end: null,
          };
          while (list.length) {
            const xy = list.shift();
            if (!line.start) {
              line.start = {
                x: xy[0],
                y: xy[1],
              };
            } else if (!line.end) {
              line.end = {
                x: xy[0],
                y: xy[1],
              };
            } else if (line.start.x === line.end.x && line.end.x === xy[0]) {
              line.end.y =  xy[1];
            } else if (line.start.y === line.end.y && line.end.y === xy[1]) {
              line.end.x = xy[0];
            } else {
              lineArray.push(line);
              line = {
                start: lineArray[lineArray.length - 1].end,
                end: {
                  x: xy[0],
                  y: xy[1],
                },
              };
            }
            if (!list.length) {
              line.end = {
                x: xy[0],
                y: xy[1],
              };
              lineArray.push(line);
            }
          }
          return lineArray.map(item => ({
            x: item.start.x + (item.end.x - item.start.x)/2,
            y: item.start.y + (item.end.y - item.start.y)/2,
          }));
        }
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


