import eventBus from './../../../../framework/utils/common/eventBus';

export default {
  getEvents() {
    return {
      'node:click': 'onClick'
    };
  },
  onClick(e) {
    eventBus.$emit('nodeClick', { node: e.item });
  },
}