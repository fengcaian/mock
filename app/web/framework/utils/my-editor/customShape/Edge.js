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
        const anchorAttr = cfg.anchorAttr;
        let path = _calculatePath(anchorAttr, start, end);
        const direction = _judgeLineDirection(start, end);
        let lineWidth = 1;
        lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
        const width = lineWidth * 10 / 3;
        const halfHeight = lineWidth * 4 / 3;
        const endArrowPath = `M 0,0 L ${width},${halfHeight} L ${width},${-halfHeight} Z`;
        const mainId = 'edge' + uniqueId();
        const { lineSegment, lineCenterPoint, centerCirclePoint } = _getEdgeControlPoint(JSON.parse(JSON.stringify(path)));
        const keyShape = group.addShape('path', {
          attrs: {
            id: mainId,
            path: path,
            lineSegment,
            turningPoint: lineSegment,
            stroke: '#42A1D0',
            lineWidth: 1,
            lineAppendWidth: 10,
            endArrow: {
              path: endArrowPath,
              fill: '#42A1D0'
            }
          }
        });
        // add red circle shape
        group.addShape('circle', {
          attrs: {
            parent: mainId,
            x: centerCirclePoint.x,
            y: centerCirclePoint.y,
            fill: cfg.lineCircle.background,
            r: 10,
            opacity: cfg.lineCircle.isShow ? 1 : 0,
            stroke: cfg.lineCircle.border,
          },
          name: 'circle-shape',
          draggable: true,
        });
        group.addShape('text', {
          attrs: {
            id: 'label' + uniqueId(),
            parent: mainId,
            x: centerCirclePoint.x,
            y: centerCirclePoint.y,
            textAlign: 'center',
            textBaseline: 'middle',
            text: cfg.lineCircle.text,
            fill: cfg.lineCircle.border,
            opacity: cfg.lineCircle.isShow ? 1 : 0,
          },
          draggable: true,
        });
        // lineCenterPoint.forEach((item) => {
        //   group.addShape('circle', {
        //     attrs: {
        //       id: 'edgeControlPoint' + uniqueId(),
        //       parent: mainId,
        //       x: item.x,
        //       y: item.y,
        //       fill: '#29B6F2',
        //       r: 4,
        //       opacity: 0,
        //       stroke: '#29B6F2',
        //     },
        //     name: 'edge-control-circle',
        //   });
        // });
        function _judgeLineDirection(p1 = {x: 0, y: 0}, p2 = {x: 0, y: 0}) {
          const width = p2.x - p1.x;
          const height = p2.y - p1.y;
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
          const copyList = JSON.parse(JSON.stringify(list));
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
          const lineCenterPoint = lineArray.map(item => ({
            x: item.start.x + (item.end.x - item.start.x)/2,
            y: item.start.y + (item.end.y - item.start.y)/2,
          }));
          let centerCirclePoint = {};
          if (lineCenterPoint.length % 2 === 0) {
            const p = copyList[(copyList.length - 1)/2];
            centerCirclePoint = {
              x: p[0],
              y: p[1],
            };
          } else {
            centerCirclePoint = lineCenterPoint[(lineCenterPoint.length - 1)/2];
          }
          return {
            lineSegment: lineArray,
            lineCenterPoint,
            centerCirclePoint,
          };
        }
        function _calculatePath(anchorAttr, startPoint, endPoint, extendLength = 20) {
          let ds = anchorAttr.outAnchor.dOut[0]; // 起点方向
          let de = anchorAttr.inAnchor.dIn[0]; // 终点方向
          const dx = endPoint.x - startPoint.x > 0 ? 2 : -2; // 起始与终点之间连线在x轴的方向(right=2,left=-2)
          const dy = endPoint.y - startPoint.y > 0 ? -1 : 1; // 起始与终点之间连线在y轴的方向(up=1,down=-1)
          let path = [['M', startPoint.x, startPoint.y]];
          let path2 = [['L', endPoint.x, endPoint.y]];
          let newStartPoint = JSON.parse(JSON.stringify(startPoint));
          let newEndPoint = JSON.parse(JSON.stringify(endPoint));
          while (!(newStartPoint.x === newEndPoint.x && newStartPoint.y === newEndPoint.y)) {
            if (de !== dx && de !== dy) { // 需要转向，同时更新newEndPoint坐标
              if (Math.abs(de) === 1) { // y轴方向
                newEndPoint.y += extendLength*(de > 0 ? 1 : -1);
                de = dx;
              } else { // x轴方向
                newEndPoint.x += extendLength*(de > 0 ? -2 : 2)/2;
                de = dy;
              }
              path2.unshift(['L', newEndPoint.x, newEndPoint.y]);
            }
            if (ds !== dx && ds !== dy) { // 需要转向，同时更新newStartPoint坐标
              if (Math.abs(ds) === 1) { // y轴方向
                newStartPoint.y += extendLength*(ds > 0 ? -1 : 1);
                ds = dx;
              } else { // x轴方向
                newStartPoint.x += extendLength*(ds > 0 ? 2 : -2)/2;
                ds = dy;
              }
              path.push(['L', newStartPoint.x, newStartPoint.y]);
            } else {
              if (_isParallel(ds, de)) { // 平行的需要转折两次
                switch (ds) {
                  case 1:
                    newStartPoint.y = newStartPoint.y - Math.abs(newEndPoint.y - newStartPoint.y)/2;
                    ds = dx;
                    break;
                  case 2:
                    newStartPoint.x = newStartPoint.x + Math.abs(newEndPoint.x - newStartPoint.x)/2;
                    ds = dy;
                    break;
                  case -1:
                    newStartPoint.y = newStartPoint.y + Math.abs(newEndPoint.y - newStartPoint.y)/2;
                    ds = dx;
                    break;
                  case -2:
                    newStartPoint.x = newStartPoint.x - Math.abs(newEndPoint.x - newStartPoint.x)/2;
                    ds = dy;
                    break;
                }
                path.push(['L', newStartPoint.x, newStartPoint.y]);
                switch (ds) {
                  case 1:
                    newStartPoint.y = newEndPoint.y;
                    break;
                  case 2:
                    newStartPoint.x = newEndPoint.x;
                    break;
                  case -1:
                    newStartPoint.y = newEndPoint.y;
                    break;
                  case -2:
                    newStartPoint.x = newEndPoint.x;
                    break;
                }
                path.push(['L', newStartPoint.x, newStartPoint.y]);
                newStartPoint = newEndPoint;
              } else { // 垂直的需要转折一次
                switch (ds) {
                  case 1:
                    newStartPoint.y = newEndPoint.y;
                    break;
                  case 2:
                    newStartPoint.x = newEndPoint.x;
                    break;
                  case -1:
                    newStartPoint.y = newEndPoint.y;
                    break;
                  case -2:
                    newStartPoint.x = newEndPoint.x;
                    break;
                }
                path.push(['L', newStartPoint.x, newStartPoint.y]);
                newStartPoint = newEndPoint;
              }
            }
          }
          path = path.concat(path2);
          path = path.reduce((result, p) => { // 去掉重复的节点
            const index = result.findIndex(item => item[1] === p[1] && item[2] === p[2]);
            if (index === -1) {
              result.push(p);
            }
            return result;
          }, []);
          if (path[0][1] === path[path.length - 1][1] || path[0][2] === path[path.length - 1][2] && path.length > 2) { // 去掉重复的节点
            path = [path[0], path[path.length - 1]];
          }
          return path;
        }
        function _isParallel(d1, d2) { // 判断是否平行， params(方向): d1,d2;return:true(平行),false(垂直)
          return Math.abs(d1) === Math.abs(d2);
        }
        return keyShape;
      },
      afterDraw(cfg, group) {
        if (cfg.sourceNode.getModel().isDoingStart && cfg.targetNode.getModel().isDoingEnd) {
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
      setState(name, value, item) {
        const group = item.getContainer();
        const shape = group.get('children')[0];
        const edgeControlCircles = group.findAllByName('edge-control-circle');
        const selectStyles = () => {
          shape.attr('stroke', '#6ab7ff');
          edgeControlCircles.forEach((circle) => {
            circle.attr('opacity', 1);
          });
        };
        const unSelectStyles = () => {
          shape.attr('stroke', '#42A1D0');
          edgeControlCircles.forEach((circle) => {
            circle.attr('opacity', 0);
          });
        };
        switch (name) {
          case 'selected':
            if (value) {
              selectStyles();
            } else {
              unSelectStyles();
            }
            break;
          case 'hover':
            if (value) {
              selectStyles();
            } else {
              unSelectStyles();
            }
            break;
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


