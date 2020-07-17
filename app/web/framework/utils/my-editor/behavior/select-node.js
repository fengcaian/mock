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
  onClick() {},
  onCanvasClick() {},
  onCanvasMouseOver() {},
  onKeyUp() {},
  onKeyDown() {},
};