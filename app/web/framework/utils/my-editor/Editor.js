import { uniqueId } from './../common';
import eventBus from './../../../framework/utils/common/eventBus';

export default class Editor {
  constructor($vue) {
    this.id = uniqueId();
    this.graph = null;
    this.$vue = $vue;
  }
  emit(event, params) {
    if (event === 'afterAddPage') {
      this.graph = params.graph;
    }
    // this.$vue.$store.dispatch('SetAfterAddPage', {
    //   event,
    //   params,
    // });
    eventBus.$emit(event, params)
  }
  on(event) {
    switch (event) {
      case 'changeNodeData':
        this.graph.refresh();
        break;
    }
  }
  add(type, item) {
    this.graph.add(type, item);
  }
  update(item, model) {
    this.graph.update(item, model);
  }
  remove(item) {
    const node = this.graph.findById(item.id);
    this.graph.remove(node);
  }
}