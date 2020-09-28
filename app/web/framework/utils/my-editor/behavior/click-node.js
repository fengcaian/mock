import eventBus from './../../../../framework/utils/common/eventBus';

export default {
  getEvents() {
    return {
      'node:click': 'onClick'
    };
  },
  onClick(e) {
    console.log('node-click');
    eventBus.$emit('nodeClick', { node: e.item });
    eventBus.$emit('test', { node: e.item });
  },
}