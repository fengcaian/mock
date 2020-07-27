const Util = require('@antv/util');
import eventBus from './../../../../framework/utils/common/eventBus';

export default {
  getEvents() {
    return {
      'edge:mouseover': 'onMouseOver',
      'edge:mouseleave': 'onMouseLeave',
      'edge:click': 'onClick',
    };
  },
  onMouseOver(e) {
    const self = this;
    const { item } = e;
    const { graph } = self;
    if (item.hasState('selected')) {
      return;
    } else {
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'hover', true);
      }
    }
    graph.paint();
  },
  onMouseLeave(e) {
    const self = this;
    const { item } = e;
    const { graph } = self;
    const group = item.getContainer();
    group.find(g => {
      if (g.attrs.isInPoint || g.attrs.isOutPoint) {
        g.attr('fill', '#fff');
      }
    });
    if (self.shouldUpdate.call(self, e)) {
      if (!item.hasState('selected')) {
        graph.setItemState(item, 'hover', false);
      }
    }
    graph.paint();
  },
  onClick(e) {
    const self = this;
    const { item } = e;
    const { graph } = self;
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    const selectedNodes = graph.findAllByState('node', 'selected');
    Util.each(selectedNodes, node => {
      graph.setItemState(node, 'selected', false);
    });
    if (!self.keydown || !self.multiple) {
      const selected = graph.findAllByState('edge', 'selected');
      Util.each(selected, edge => {
        if (edge !== item) {
          graph.setItemState(edge, 'selected', false);
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
}