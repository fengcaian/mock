export default {
  getEvents() {
    return {
      'edge:mousedown': 'onMouseDown',
      'mousemove': 'onMouseMove',
      'mouseup': 'onMouseUp',
    };
  },
  onMouseDown(e) {
    this.item = e.item;
    this.target = e.target;
  },
  onMouseMove(e) {
    this.item = e.item;
    this.target = e.target;
    if (this.target && this.item) {
      this._updateEdge(e);
    }
  },
  onMouseUp(e) {
    this.target = null;
    this.item = null;
    this.graph.setMode('default');
    // console.log(e);
    // console.log(e.item);
  },
  _updateEdge(event) {
    const shape = this.item.get('keyShape');
    const group = this.item.getContainer();
    const path = shape.attrs.path;
    shape.attr({
      turningPoint: [3, 4],
    });
    this.graph.paint();
  },
};