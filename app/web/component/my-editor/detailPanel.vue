<template>
  <div class="detail-panel">
    <div>
      <div v-if="status === 'node-selected'" class="panel">
        <div class="panel-title">模型详情</div>
        <div class="block-container">
          <el-form size="mini" label-position="right" label-width="75px" :model="node">
            <el-form-item label="名称">
              <el-input size="mini" class="width-100" v-model="node.label" @change="handleChangeName"></el-input>
            </el-form-item>
            <el-form-item label="核查链ID">
              <el-input size="mini" class="width-100" v-model="node.checkId"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-if="status === 'canvas-selected'" class="panel">
        <div class="panel-title">画布</div>
        <div class="block-container">
          <el-checkbox v-model="showGrid" @change="changeGridState">网格对齐</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Grid } from '@antv/g6';
import eventBus from './../../framework/utils/common/eventBus';

export default {
  data() {
    return {
      status: 'canvas-selected',
      showGrid: false,
      page: {},
      graph: {},
      item: {},
      node: {
        label: '',
        checkId: ''
      },
      grid: null
    };
  },
  created() {
    this.bindEvent();
  },
  destroyed() {
    eventBus.$off('afterAddPage');
    eventBus.$off('nodeSelectChange');
  },
  methods: {
    bindEvent() {
      let self = this;
      eventBus.$on('afterAddPage', page => {
        self.page = page;
        self.graph = self.page.graph;
        eventBus.$on('nodeSelectChange', item => {
          if (item.select === true && item.target.getType() === 'node') {
            self.status = 'node-selected';
            self.item = item.target;
            self.node = item.target.getModel();
          } else {
            self.status = 'canvas-selected';
            self.item = null;
            self.node = null;
          }
        });
      });
    },
    handleChangeName(e) {
      const model = {
        label: e
      };
      this.graph.update(this.item, model);
    },
    changeGridState(value) {
      if (value) {
        this.grid = new Grid();
        this.graph.addPlugin(this.grid);
      } else {
        this.graph.removePlugin(this.grid);
      }
    }
  },
}
</script>

<style scoped>
  .detail-panel {
    height: 100%;
    position: absolute;
    right: 0;
    z-index: 2;
    background: #f7f9fb;
    width: 200px;
    border-left: 1px solid #e6e9ed;
  }
  .detail-panel .block-container {
    padding: 16px 8px;
  }
  .panel-title {
    height: 32px;
    border-top: 1px solid #dce3e8;
    border-bottom: 1px solid #dce3e8;
    background: #ebeef2;
    color: #000;
    line-height: 28px;
    padding-left: 12px;
  }
  .width-100 {
    width: 100px;
  }
</style>