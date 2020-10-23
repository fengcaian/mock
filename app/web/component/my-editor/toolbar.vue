<template>
  <div class="toolbar">
    <link
      rel="stylesheet"
      type="text/css"
      href="//at.alicdn.com/t/font_598462_3xve1872wizzolxr.css"/>
    <i
      class="command iconfont icon-undo"
      title="撤销"
      :class="undoList.length > 0 ? '' : 'disable'"
      @click="handleUndo">
    </i>
    <i
      class="command iconfont icon-redo"
      title="重做"
      :class="redoList.length > 0 ? '' : 'disable'"
      @click="handleRedo">
    </i>
    <span class="separator"></span>
    <i
      data-command="delete"
      class="command iconfont icon-delete-o"
      title="删除"
      :class="selectedItem && selectedItem.length ? '' : 'disable'"
      @click="handleDelete">
    </i>
    <span class="separator"></span>
    <i
      data-command="zoomIn"
      class="command iconfont icon-zoom-in-o"
      title="放大"
      @click="handleZoomIn">
    </i>
    <i
      data-command="zoomOut"
      class="command iconfont icon-zoom-out-o"
      title="缩小"
      @click="handleZoomOut">
    </i>
    <i
      data-command="autoZoom"
      class="command iconfont icon-fit"
      title="适应画布"
      @click="handleAutoZoom">
    </i>
    <i
      data-command="resetZoom"
      class="command iconfont icon-actual-size-o"
      title="实际尺寸"
      @click="handleResetZoom">
    </i>
    <span class="separator"></span>
    <i
      data-command="toBack"
      class="command iconfont icon-to-back"
      :class="selectedItem && selectedItem.length ? '' : 'disable'"
      title="层级后置"
      @click="handleToBack">
    </i>
    <i
      data-command="toFront"
      class="command iconfont icon-to-front"
      :class="selectedItem && selectedItem.length ? '' : 'disable'"
      title="层级前置"
      @click="handleToFront">
    </i>
    <el-button size="mini" class="middle" type="primary" @click="consoleData">控制台输出数据</el-button>
    <el-button size="mini" class="middle" type="primary" @click="outOfEditModel">退出编辑模式</el-button>
    <el-button size="mini" class="middle" type="primary" @click="inOfEditModel">进入编辑模式</el-button>
    <el-button size="mini" class="middle" type="primary" @click="saveGraph">保存</el-button>
    <el-button size="mini" class="middle" type="primary" @click="getData">getData</el-button>
    <dialog-node-detail
      v-if="isShowNodeDetailDialog"
      :nodeDetailDialogVisible="isShowNodeDetailDialog"
      @dialogNodeDetailCb="dialogNodeDetailCb">
    </dialog-node-detail>
  </div>
</template>

<script>
import { Grid } from '@antv/g6';
import Util from '@antv/g6/es/util';
import eventBus from './../../framework/utils/common/eventBus';
import { uniqueId, getBox } from './../../framework/utils/common';

import dialogNodeDetail from './cpmponents/dialog-node-detail';

export default {
  components: {
    dialogNodeDetail,
  },
  data() {
    return {
      page: {},
      graph: {},
      grid: null,
      redoList: [],
      undoList: [],
      editor: null,
      command: null,
      selectedItem: null,
      multiSelect: false,
      addGroup: false,
      isShowNodeDetailDialog: false,
    };
  },
  watch: {
    selectedItem(val) {
      this.addGroup = val && val.length > 1;
    }
  },
  created() {
    this.grid = new Grid();
    this.init();
  },
  mounted() {
    this.bindEvent();
  },
  beforeDestroy() {
    eventBus.$off('afterAddPage');
    eventBus.$off('add');
    eventBus.$off('update');
    eventBus.$off('delete');
    eventBus.$off('updateItem');
    eventBus.$off('addItem');
    eventBus.$off('nodeSelectChange');
    eventBus.$off('deleteItem');
    eventBus.$off('multiSelectEnd');
  },
  methods: {
    init() {
      const { editor, command } = this.$parent;
      this.editor = editor;
      this.command = command;
    },
    bindEvent() {
      let self = this;
      eventBus.$on('afterAddPage', page => {
        console.log('toolbar-afterAddPage');
        self.page = page;
        self.graph = page.graph;
      });
      eventBus.$on('add', data => {
        self.redoList = data.redoList;
        self.undoList = data.undoList;
      });
      eventBus.$on('update', data => {
        self.redoList = data.redoList;
        self.undoList = data.undoList;
      });
      eventBus.$on('delete', data => {
        self.redoList = data.redoList;
        self.undoList = data.undoList;
      });
      eventBus.$on('updateItem', item => {
        self.command.executeCommand('update', [item]);
      });
      eventBus.$on('addItem', item => {
        self.command.executeCommand('add', [item]);
      });
      eventBus.$on('nodeSelectChange', () => {
        console.log('i am toolbar nodeSelectChange');
        self.selectedItem = self.graph.findAllByState('node', 'selected');
        self.selectedItem = self.selectedItem.concat(
          ...self.graph.findAllByState('edge', 'selected')
        );
      });
      eventBus.$on('deleteItem', () => {
        self.handleDelete();
      });
      eventBus.$on('multiSelectEnd', () => {
        self.multiSelect = false;
        self.selectedItem = self.graph.findAllByState('node', 'selected');
      });
      eventBus.$on('nodeClick', (data) => {
        console.log(data.node._cfg);
        console.log(self.graph.getCurrentMode());
        self.isShowNodeDetailDialog = true;
      });
    },
    handleUndo() {
      if (this.undoList.length > 0) this.command.undo();
    },
    handleRedo() {
      if (this.redoList.length > 0) this.command.redo();
    },
    handleDelete() {
      if (this.selectedItem.length > 0) {
        this.command.executeCommand('delete', this.selectedItem);
        eventBus.$emit('nodeSelectChange', { target: this.selectedItem[0], select: false });
        this.selectedItem = null;
      }
    },
    getFormatPadding() {
      return Util.formatPadding(this.graph.get('fitViewPadding'));
    },
    getViewCenter() {
      const padding = this.getFormatPadding();
      const graph = this.graph;
      const width = this.graph.get('width');
      const height = graph.get('height');
      return {
        x: (width - padding[2] - padding[3]) / 2 + padding[3],
        y: (height - padding[0] - padding[2]) / 2 + padding[0]
      };
    },
    handleZoomIn() {
      const currentZoom = this.graph.getZoom();
      this.graph.zoomTo(currentZoom + 0.5, this.getViewCenter());
    },
    handleZoomOut() {
      const currentZoom = this.graph.getZoom();
      this.graph.zoomTo(currentZoom - 0.5, this.getViewCenter());
    },
    handleToBack() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.selectedItem.forEach(item => {
          item.toBack();
          this.graph.paint();
        });
      }
    },
    handleToFront() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.selectedItem.forEach(item => {
          if (item.getType() === 'edge') {
            // const nodeGroup = this.graph.get("nodeGroup");
            // const edgeGroup = item.get("group");
            // nodeGroup.toFront();
            // edgeGroup.toFront()
          } else {
            item.toFront();
          }

          this.graph.paint();
        });
      }
    },
    handleAutoZoom() {
      this.graph.fitView(20);
    },
    handleResetZoom() {
      this.graph.zoomTo(1, this.getViewCenter());
    },
    getPosition(items) {
      const boxList = [];
      items.forEach(item => {
        const box = item.getBBox();
        boxList.push(getBox(box.x, box.y, box.width, box.height));
      });
      let minX1, minY1, MaxX2, MaxY2;
      boxList.forEach(box => {
        if (typeof minX1 === 'undefined') {
          minX1 = box.x1;
        }
        if (typeof minY1 === 'undefined') {
          minY1 = box.y1;
        }
        if (typeof MaxX2 === 'undefined') {
          MaxX2 = box.x2;
        }
        if (typeof MaxY2 === 'undefined') {
          MaxY2 = box.y2;
        }
        if (minX1 > box.x1) {
          minX1 = box.x1;
        }
        if (minY1 > box.y1) {
          minY1 = box.y1;
        }
        if (MaxX2 < box.x2) {
          MaxX2 = box.x2;
        }
        if (MaxY2 < box.y2) {
          MaxY2 = box.y2;
        }
      });
      const width = MaxX2 - minX1,
        height = MaxY2 - minY1,
        x = minX1 + width / 2,
        y = minY1 + height / 2,
        id = 'team' + uniqueId();
      const model = {
        id: id,
        width,
        height,
        x,
        y,
        type: 'teamNode'
      };
      this.command.executeCommand('add', model);
    },
    consoleData() {
      console.log(this.graph.save());
      console.log('consoleData = ' + this.graph.getCurrentMode());
    },
    outOfEditModel() {
      this.graph.setMode('default');
      this.graph.removePlugin(this.grid);
      (this.selectedItem || []).forEach(item => {
        this.graph.setItemState(item, 'hover', false);
        eventBus.$emit('nodeSelectChange', { target: item, select: false });
      });
      this.selectedItem = null;
      this.$emit('editorModeChange', { mode: 'default' });
    },
    inOfEditModel() {
      this.graph.setMode('edit');
      if (!this.grid.cfg) {
        this.grid = new Grid();
      }
      this.graph.addPlugin(this.grid);
      console.log('inOfEditModel = ' + this.graph.getCurrentMode());
      this.$emit('editorModeChange', { mode: 'edit' });
    },
    saveGraph() {
      this.$emit('saveG6GraphData', this.graph.save());
    },
    getData() {
      window.g6Data = this.graph.save();
    },
    dialogNodeDetailCb() {
      this.isShowNodeDetailDialog = false;
    },
  },
};
</script>

<style scoped>
  .toolbar {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #e9e9e9;
    height: 42px;
    line-height: 42px;
    z-index: 3;
    box-shadow: 0 8px 12px 0 rgba(0, 52, 107, 0.04);
    position: absolute;
  }
  .toolbar .command:nth-of-type(1) {
    margin-left: 24px;
  }
  .toolbar .command {
    box-sizing: border-box;
    width: 27px;
    height: 42px;
    line-height: 42px;
    margin: 0 6px;
    border-radius: 2px;
    padding-left: 4px;
    display: inline-block;
    border: 1px solid rgba(2, 2, 2, 0);
  }
  .toolbar .command:hover {
    cursor: pointer;
    border: 1px solid #e9e9e9;
  }
  .toolbar .disable {
    color: rgba(0, 0, 0, 0.25);
  }
  .toolbar .separator {
    margin: 4px;
    border-left: 1px solid #e9e9e9;
  }
  .middle {
    vertical-align: 5px;
  }
</style>