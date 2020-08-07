export default {
  getEvents() {
    return {
      'node:mousedown': 'onMouseDown',
      'mousemove': 'onMouseMove',
      'mouseup': 'onMouseUp',
      'canvas:mouseleave': 'onOutOfRange'
    };
  },
  onMouseUp(e) {},
};