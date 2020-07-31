<template>
  <div class="detail-panel">
    <div>
      <div v-if="status === 'node-selected'" class="panel">
        <div class="panel-title">节点详情</div>
        <div class="block-container">
          <el-form size="mini" label-position="right" label-width="75px" :model="node">
            <el-form-item label="名称">
              <el-input size="mini" class="width-100" v-model="node.label" @change="handleChangeName('node')"></el-input>
            </el-form-item>
            <el-form-item label="核查链ID">
              <el-input size="mini" class="width-100" v-model="node.checkId"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-if="status === 'edge-selected'">
        <div class="panel-title">边详情</div>
        <div class="block-container">
          <el-form size="mini" label-position="right" label-width="75px" :model="edge">
            <el-form-item label="展示圆圈">
              <el-radio-group v-model="edge.lineCircle.isShow" @change="handleChangeName('edge')">
                <el-radio class="margin-r-0" :label="true">是</el-radio>
                <el-radio class="margin-r-0" :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="圆内文字">
              <el-input size="mini" class="width-100" v-model="edge.lineCircle.text" @change="handleChangeName('edge')"></el-input>
            </el-form-item>
            <el-form-item label="背景颜色">
              <el-color-picker v-model="edge.lineCircle.background" show-alpha :predefine="predefineColors" @change="handleChangeName('edge')"></el-color-picker>
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
      item: {},
      node: {
        label: '',
        checkId: ''
      },
      edge: {
        lineCircle: {
          isShow: true,
          text: '',
          background: '',
        },
      },
      grid: null,
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ]
    };
  },
  computed: {
    page() {
      return this.$store.state.g6Editor;
    },
    graph() {
      return this.$store.state.g6Editor.graph;
    }
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
      });
      eventBus.$on('nodeSelectChange', item => {
        if (item.select === true && item.target.getType() === 'node') {
          self.status = 'node-selected';
          self.item = item.target;
          self.node = item.target.getModel();
        } else if (item.select === true && item.target.getType() === 'edge') {
          self.status = 'edge-selected';
          self.item = item.target;
          self.edge = item.target.getModel();
        } else {
          self.status = 'canvas-selected';
          self.item = null;
          self.node = null;
          self.edge = null;
        }
      });
    },
    handleChangeName(type) {
      let model = {};
      if (type === 'node') {
        model = this.node;
      }
      if (type === 'edge') {
        model = this.edge;
      }
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
  .margin-r-0 {
    margin-right: 0;
  }
</style>