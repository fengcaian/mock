import { uniqueId } from './../common';

export default class Command {
  constructor(editor) {
    this.editor = editor;
    this.undoList = [];
    this.redoList = [];
  }

  executeCommand(key, data) {
    const list = [];
    data.forEach((item) => {
      let model = item;
      if (key === 'add') {
        model.id = item.type + uniqueId();
      }
      if (key === 'delete') {
        if (item.getType() === 'node') {
          const edges = item.getEdges();
          model = item.getModel();
          model.type = item.getType();
          model.id = item.get('id');
          edges.forEach(edge => {
            let edgeModel = edge.getModel();
            edgeModel.type = 'edge';
            edgeModel.id = edge.get('id');
            list.push(edgeModel)
          })
        } else if (item.getType() === 'edge') {
          model = item.getModel();
          model.type = item.getType();
          model.id = item.get('id');
        }
      }
      list.push(model);
      this.doCommand(key, model);
    });
    this.undoList.push({ key, datas: list });
    if (key === 'delete') {
      this.redoList =[];
    }
    this.editor.emit(key, { undoList: this.undoList, redoList: this.redoList });
  }

  doCommand(key, data) {
    switch (key) {
      case 'add':
        this.add(data.type, data);
        break;
      case 'update':
        this.update(data.item, data.newModel);
        break;
      case 'delete':
        this.remove(data);
        break;
    }
  }

  add(type, item) {
    this.editor.add(type, item);
  }

  update(item, model) {
    this.editor.update(item, model)
  }

  remove(item) {
    this.editor.remove(item)
  }

  undo() {
    const undoData = this.undoList.pop();
    const edgeList = [];
    const list = [];
    for (let i = 0; i < undoData.datas.length; i += 1) {
      const data = undoData.datas[i];
      if (data.type === 'edge') {
        edgeList.push(data);
        continue;
      }
      list.push(data);
      this.doUndo(undoData.key, data);
    }
    for (let j = 0; j < edgeList.length; j += 1) {
      const edge = edgeList[j];
      if (edge.source.destroyed) {
        edge.source = edge.sourceId;
      }
      if (edge.target.destroyed) {
        edge.target = edge.targetId;
      }
      list.push(edge);
      this.doUndo(undoData.key, edge)
    }
    this.redoList.push({ key: undoData.key, datas: list });
    this.editor.emit(undoData.key, { undoList: this.undoList, redoList: this.redoList })
  }
  doUndo(key, data) {
    switch (key) {
      case 'add':
        this.remove(data);
        break;
      case 'update':
        this.update(data.item, data.newModel);
        break;
      case 'remove':
        this.add(data);
        break;
    }
  }
  redo() {
    const redoData = this.redoList.pop();
    const list = [];
    const edgeList = [];
    for (let i = 0; i < redoData.datas.length; i += 1) {
      const data = redoData.datas[i];
      if (data.type === 'edge') {
        edgeList.push(data);
        continue;
      }
      list.push(data);
      this.doRedo(redoData.key, data);
    }
    for (let j = 0; j < edgeList.length; j += 1) {
      const edge = edgeList[j];
      if (edge.source.destroyed) {
        edge.source = edge.sourceId;
      }
      if (edge.target.destroyed) {
        edge.target = edge.targetId;
      }
      list.push(edge);
      this.doRedo(redoData.key, edge);
    }
    this.undoList.push({ key: redoData.key, datas: list });
    this.editor.emit(redoData.key, { undoList: this.undoList, redoList: this.redoList });
  }
  doRedo(key, data) {
    switch (key) {
      case 'add':
        this.add(data.type, data);
        break;
      case 'update':
        this.update(data.type, data);
        break;
      case 'remove':
        this.remove(data.type, data);
        break;
    }
  }
  delete(item) {
    this.executeCommand('delete', [item])
  }
}