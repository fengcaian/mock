import G6 from '@antv/g6';
import { uniqueId } from './../../../framework/utils/common';
const MIN_ARROW_SIZE = 3;

const customEdge = {
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

    const lineDash = [4,2,1,2];
    const interval = 9;
    G6.registerEdge('customEdge', {
      draw(cfg, group) {
        let sourceNode, targetNode;
        if (typeof (cfg.source) === 'string') {
          cfg.source = cfg.sourceNode
        }
        if(!cfg.start){
          cfg.start={
            x:0,
            y:17
          }
        }
        if(!cfg.end){
          cfg.end={
            x:0,
            y:-17
          }
        }
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        if (!cfg.source.x) {
          sourceNode = cfg.sourceNode.getModel();
        }
        if (typeof (cfg.target) === 'string') {
          cfg.target = cfg.targetNode
        }
        if (!cfg.target.x) {
          targetNode = cfg.sourceNode.getModel();
        }

        let path = []
        let hgap = Math.abs(end.x - startPoint.x)
        if (endPoint.x > startPoint.x) {
          path = [
            ['M', startPoint.x, startPoint.y],
            [
              'C',
              startPoint.x,
              startPoint.y + hgap / (hgap / 50),
              endPoint.x,
              endPoint.y - hgap / (hgap / 50),
              endPoint.x,
              endPoint.y - 4
            ],
            [
              'L',
              endPoint.x,
              endPoint.y
            ]
          ]
        } else {
          path = [
            ['M', startPoint.x, startPoint.y],
            [
              'C',
              startPoint.x,
              startPoint.y + hgap / (hgap / 50),
              endPoint.x,
              endPoint.y - hgap / (hgap / 50),
              endPoint.x,
              endPoint.y - 4
            ],
            [
              'L',
              endPoint.x,
              endPoint.y
            ]
          ]
        }
        let lineWidth = 1;
        lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
        const width = lineWidth * 10 / 3;
        const halfHeight = lineWidth * 4 / 3;
        const radius = lineWidth * 4;
        const endArrowPath = [
          ['M', -width, halfHeight],
          ['L', 0, 0],
          ['L', -width, -halfHeight],
          ['A', radius, radius, 0, 0, 1, -width, halfHeight],
          ['Z']
        ];
        const keyShape = group.addShape('path', {
          attrs: {
            id: 'edge' + uniqueId(),
            path: path,
            stroke: '#b8c3ce',
            lineAppendWidth: 10,
            endArrow: {
              path: endArrowPath,
            }
          }
        });
        return keyShape
      },
      afterDraw(cfg, group) {
        if (cfg.sourceNode.getModel().isDoingStart && cfg.sourceNode.getModel().isDoingEnd) {
          const shape = group.get('children')[0];
          const length = shape.getTotalLength(); // G 增加了 totalLength 的接口
          let totalArray = [];
          for (var i = 0; i < length; i += interval) {
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
        const shape = group.get("children")[0];
        const selectStyles = () => {
          shape.attr("stroke", "#6ab7ff");
        };
        const unSelectStyles = () => {
          shape.attr("stroke", "#b8c3ce");
        };

        switch (name) {
          case "selected":
          case "hover":
            if (value) {
              selectStyles()
            } else {
              unSelectStyles()
            }
            break;
        }
      }
    });
    G6.registerEdge('link-edge', {
      draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        let path = [];
        path = [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x, endPoint.y]
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

export default customEdge
