import eventBus from './../../../../framework/utils/common/eventBus';

export default {
  getDefaultCfg() {
    return {
      shiftKeyCode: 16,
      ctrlKeyCode: 238
    };
  },
  getEvents() {
    return {
      keydown: 'onKeyDown',
      keyup: 'onKeyUp',
    };
  },
  onKeyDown(e) {
    const code = e.keyCode || e.which;
    switch (code) {
      case this.shiftKeyCode:
      case this.ctrlKeyCode:
        eventBus.$emit('deleteItem');
        break;
    }
  },
  onKeyUp() {},
};