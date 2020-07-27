import eventBus from './../../../../framework/utils/common/eventBus';
export default {
  getEvents() {
    return {
      'node:contextmenu': 'onContextMenu',
      'mousedown': 'onMouseDown',
      'canvas:click': 'onCanvasClick',
    };
  },
  onContextMenu(e) {
    eventBus.$emit('contextmenuClick', e);
  },
  onMouseDown(e) {
    eventBus.$emit('mousedown', e);
  },
  onCanvasClick(e){
    eventBus.$emit('canvasClick', e);
  }

};