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
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    const selected = graph.findAllByState('node', 'selected');
    Util.each(selected, node => {
      graph.setItemState(node, 'selected', false);
      eventBus.$emit('nodeSelectChange', { target: node, select: false });
    });
    const selectedEdges = graph.findAllByState('edge', 'selected');
    Util.each(selectedEdges, edge => {
      graph.setItemState(edge, 'selected', false);
      eventBus.$emit('nodeSelectChange', { target: edge, select: false });
      const data = {};
      data.item = edge;
      data.customerProps = {
        isAddCircle: true,
      };
      eventBus.$emit('updateItem', data);
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
  onKeyDown() {
    this.keydown = false;
  },
};