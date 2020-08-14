export default {
  getEvents() {
    return {
      'edge:mousedown': 'onMouseDown',
      'mousemove': 'onMouseMove',
      'mouseup': 'onMouseUp',
    };
  },
  onMouseDown(e) {
    console.log(e);
    console.log(e.item);
    console.log(e.target);
    console.log(e.item.getModel());
    this.item = e.item;
    this.target = e.target;
  },
  onMouseMove(e) {
    this.item = e.item;
    this.target = e.target;
    console.log(e.target);
    if (this.target && this.item) {
      this._updateEdge(e);
    }
  },
  onMouseUp(e) {
    this.target = null;
    this.item = null;
    console.log('i am up2');
    this.graph.setMode('default');
    console.log('i am up2');
    // console.log(e);
    // console.log(e.item);
  },
  _updateEdge(event) {
    const shape = this.item.get('keyShape');
    const group = this.item.getContainer();
    console.log(shape);
    const path = shape.attrs.path;
    console.log(path);
    shape.attr({
      turningPoint: [3, 4],
    });
    this.graph.paint();
  },
};