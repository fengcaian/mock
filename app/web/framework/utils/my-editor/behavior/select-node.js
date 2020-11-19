import eventBus from './../../../../framework/utils/common/eventBus';
const Util = require('@antv/util');
let multiple = false;
export default {
  getDefaultCfg() {
    return {
      shiftKeyCode: 16,
    };
  },
  getEvents() {
    return {
      'node:click': 'onClick',
      'canvas:click': 'onCanvasClick',
      'canvas:mouseover': 'onCanvasMouseOver',
      keyup: 'onKeyUp',
      keydown: 'onKeyDown',
    };
  },
  onClick(e) {
    const self = this;
    const { item } = e;
    const { graph } = self;
    const autoPaint = graph.get('autoPaint');
    this.target = item;
    graph.setAutoPaint(false);
    const selectedEdges = graph.findAllByState('edge', 'selected');
    Util.each(selectedEdges, edge => {
      graph.setItemState(edge, 'selected', false);
    });
    if (!multiple) {
      const selected = graph.findAllByState('node', 'selected');
      Util.each(selected, node => {
        if (node !== item) {
          graph.setItemState(node, 'selected', false);
        }
      });
    }
    if (item.hasState('selected')) {
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'selected', false);
      }
      eventBus.$emit('nodeSelectChange', { target: item, select: false });
    } else {
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'selected', true);
      }
      eventBus.$emit('nodeSelectChange', { target: item, select: true });
    }
    graph.setAutoPaint(autoPaint);
    graph.paint();
  },
  onCanvasClick() {
    const { graph } = this;
    this.target = null;
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    const selectedNodes = graph.findAllByState('node', 'selected');
    Util.each(selectedNodes, node => {
      graph.setItemState(node, 'selected', false);
      eventBus.$emit('nodeSelectChange', { target: node, select: false });
    });
    const selectedEdges = graph.findAllByState('edge', 'selected');
    Util.each(selectedEdges, edge => {
      graph.setItemState(edge, 'selected', false);
      eventBus.$emit('nodeSelectChange', { target: edge, select: false });
      graph.setItemState(edge, 'hover', false);
    });
    graph.paint();
    graph.setAutoPaint(autoPaint);
  },
  onCanvasMouseOver() {
    const { graph } = this;
    graph.paint();
  },
  onKeyUp(e) {
    const code = e.keyCode || e.which;
    switch (code) {
      case this.shiftKeyCode:
        multiple = false;
        break;
    }
  },
  onKeyDown(e) {
    const code = e.keyCode || e.which;
    if (this.target) { // 选中了某个节点或边
      const model = this.target.get('model');
      const pos = {
        x: model.x,
        y: model.y,
      };
      switch (code) {
        case 37:
          --pos.x;
          break;
        case 38:
          --pos.y;
          break;
        case 39:
          ++pos.x;
          break;
        case 40:
          ++pos.y;
          break;
        case this.shiftKeyCode:
          multiple = true;
          break;
      }
      this.graph.update(this.target, pos);
    } else {
      switch (code) {
        case this.shiftKeyCode:
          multiple = true;
          break;
      }
    }
  },
};