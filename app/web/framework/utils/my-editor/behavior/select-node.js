import eventBus from './../../../../framework/utils/common/eventBus';
const Util = require('@antv/util');

export default {
  getDefaultCfg() {
    return {
      multiple: true,
      keyCode: 16
    };
  },
  getEvents() {
    return {
      'node:click': 'onClick',
      'canvas:click': 'onCanvasClick',
      'canvas:mouseover': 'onCanvasMouseOver',
      keyup: 'onKeyUp',
      keydown: 'onKeyDown'
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
    if (!self.keydown || !self.multiple) {
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
      console.log('node unselected');
      eventBus.$emit('nodeSelectChange', { target: item, select: false });
    } else {
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'selected', true);
      }
      console.log('node selected');
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
    this.keydown = code === this.keyCode;
  },
  onKeyDown(e) {
    this.keydown = false;
    if (this.target) {
      const model = this.target.get('model');
      const pos = {
        x: model.x,
        y: model.y,
      };
      const code = e.keyCode || e.which;
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
      }
      this.graph.update(this.target, pos);
    }
  },
};