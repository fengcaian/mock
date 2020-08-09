import G6 from '@antv/g6';
import _ from 'lodash';
import { uniqueId } from './../../common';
import eventBus from './../../../../framework/utils/common/eventBus';
let startPoint = null;
let startItem = null;
let endPoint = {};
let activeItem = null;
let curInPoint = null;

export default {
  getEvents() {
    return {
      mousemove: 'onMouseMove',
      mouseup: 'onMouseUp',
      'node:mouseover': 'onMouseOver',
      'node:mouseleave': 'onMouseLeave'
    };
  },
  onMouseMove(e) {
    const { item } = e;
    if (!startPoint) {
      this.graph.find('node', node => {
        const group = node.get('group');
        const { children } = group.cfg;
        children.map(child => {
          if (child.attrs.isInAnchorOut || child.attrs.isBothWayAnchorOut) {
            child.attr('opacity', '0.3');
          }
          if (child.attrs.isInAnchor || child.attrs.isBothWayAnchor) {
            child.attr('opacity', '1');
          }
        });
      });
      const startX = parseInt(e.target.attrs.x);
      const startY = parseInt(e.target.attrs.y);
      startPoint = {x: startX, y: startY};
      startItem = item;
      this.edge = this.graph.addItem('edge', {
        id: 'edge' + uniqueId(),
        source: item,
        target: item,
        start: startPoint,
        end: startPoint,
        shape: 'link-edge',
      });
    } else {
      const point = { x: e.x, y: e.y };
      if (this.edge) {
        this.graph.updateItem(this.edge, {
          target: point,
          customerProps: {
            addCircle: true,
          },
        });
      }
    }
  },
  onMouseUp(e) {
    const { item } = e;
    if (item && item.getType() === 'node') {
      const group = item.getContainer();
      if (e.target.attrs.isInAnchor || e.target.attrs.isBothWayAnchor) {
        const children = group.cfg.children;
        children.map(child => {
          if ((child.attrs.isInAnchorOut || child.attrs.isBothWayAnchorOut) && child.attrs.parent === e.target.attrs.id) {
            activeItem = child;
          }
        });
        curInPoint = e.target;
      } else if (e.target.attrs.isInAnchorOut || e.target.attrs.isBothWayAnchorOut) {
        activeItem = e.target;
        const children = group.cfg.children;
        children.map(child => {
          if ((child.attrs.isInAnchor || child.attrs.isBothWayAnchor) && child.attrs.id === e.target.attrs.parent) {
            curInPoint = child;
          }
        });
      }
      if (activeItem) {
        const endX = parseInt(curInPoint.attrs.x);
        const endY = parseInt(curInPoint.attrs.y);
        endPoint = { x: endX, y: endY };
        if (this.edge) {
          this.graph.removeItem(this.edge);
          const existEdge = this.graph.find('edge', edge => { // 判断该start->end坐标的edge是否存在
            const edgeModel = edge.get('model');
            return _.isEqual(edgeModel.start, startPoint) && _.isEqual(edgeModel.end, endPoint) && edgeModel.sourceId === startItem._cfg.id && edgeModel.targetId === item._cfg.id;
          });
          if (!existEdge) {
            const model = {
              id: 'edge' + uniqueId(),
              source: startItem,
              target: item,
              sourceId: startItem._cfg.id,
              targetId: item._cfg.id,
              start: startPoint,
              end: endPoint,
              type: 'edge',
              shape: 'customEdge',
              lineCircle: {
                text: '0',
                background: '#ffffff',
                border: '#1890ff',
                isShow: false,
              },
            };
            eventBus.$emit('addItem', model);
          }
        }
      } else {
        if (this.edge)
          this.graph.removeItem(this.edge);
      }
    } else {
      if (this.edge)
        this.graph.removeItem(this.edge);
    }
    this.graph.find('node', node => {
      const group = node.get('group');
      const children = group.cfg.children;
      children.map(child => {
        if (child.attrs.isInAnchorOut || child.attrs.isInAnchor || child.attrs.isBothWayAnchorOut) {
          child.attr('opacity', '0');
        }
        if (child.attrs.isOutAnchor || child.attrs.isBothWayAnchor) {
          child.attr('opacity', '0');
          child.attr('fill', '#fff');
        }
      })
    });
    if (startItem) {
      this.graph.setItemState(startItem, 'hover', false);
    }
    this.graph.paint();
    startPoint = null;
    startItem = null;
    endPoint = {};
    activeItem = null;
    curInPoint = null;
    this.graph.setMode('default');
  },
  onMouseOver(e) {
    const { item } = e;
    if (item && item.getType() === 'node') {
      if ((e.target.attrs.isOutAnchorOut || e.target.attrs.isBothWayAnchorOut) && !this.hasTran) {
        this.hasTran = true;
        let matrix = e.target.getMatrix();
        if (!matrix) {
          matrix = G6.Util.mat3.create();
        }
        matrix = G6.Util.transform(matrix, [
          ['t', 0, 3],
          ['s', 1.2, 1.2]
        ]);
        e.target.setMatrix(matrix);
      }
      this.graph.paint();
    }
  },
  onMouseLeave() {
    this.graph.find('node', node => {
      const group = node.get('group');
      const children = group.cfg.children;
      children.map(child => {
        if (child.attrs.isInAnchorOut || child.attrs.isBothWayAnchorOut) {
          child.resetMatrix();
        }
      })
    });
    this.hasTran = false;
    this.graph.paint();
  },
}
