const Util = require('@antv/util');
import eventBus from './../../../../framework/utils/common/eventBus';

export default {
  getDefaultCfg() {
    return {
      deleteKeyCode: 46,
    };
  },
  getEvents() {
    return {
      keyup: 'onKeyUp',
      keydown: 'onKeyDown'
    };
  },
  onKeyDown(e) {
    const code = e.keyCode || e.which;
    switch (code) {
      case this.deleteKeyCode:
        eventBus.$emit('deleteItem');
        break;
    }
  },
  onKeyUp() {},
}