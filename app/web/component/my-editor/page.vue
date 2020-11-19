<template>
  <div class="page">
    <div :id="pageId" class="graph-container" style="position: relative;"></div>
  </div>
</template>

<script>
import G6 from '@antv/g6';
import Util from '@antv/g6/es/util';
import { initBehaviors } from './../../framework/utils/my-editor/behavior';

export default {
  props: {
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pageId: 'graph-container',
      graph: null
    };
  },
  created() {
    initBehaviors();
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  beforeDestroy() {
    this.graph.clear();
    this.graph.destroy();
    this.graph = null;
  },
  methods: {
    init() {
      const defaultLayout = {
        type: 'compactBox',
        direction: 'TB',
        getId: function getId(d) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 16;
        },
        getWidth: function getWidth() {
          return 16;
        },
        getVGap: function getVGap() {
          return 40;
        },
        getHGap: function getHGap() {
          return 70;
        },
      };
      const height =  this.height - 42;
      const width =  this.width - 400;
      this.graph = new G6.Graph({
        container: 'graph-container',
        height: height,
        width: width,
        modes: {
          // 支持的 behavior
          default: [
            'zoom-canvas',
            'click-node',
            'customer-events',
            'add-menu'
          ],
          multiSelect: ['multi-select'],
          addEdge: ['add-edge'],
          moveNode:['drag-item'],
          moveEdge:['drag-edge'],
          edit: ['hover-node', 'select-node', 'hover-edge', 'select-edge', 'drag-canvas', 'keyboard'],
        },
        layout: defaultLayout
        // renderer: 'svg'
      });
      const { editor, command } = this.$parent;
      editor.emit('afterAddPage', { graph: this.graph, command });
      this.$store.dispatch('SetG6Editor', { graph: this.graph, command });
      this.readData();
    },
    readData() {
      let data = this.data;
      if (data) {
        this.graph.read(data);
      }
      this.graph.zoomTo(0.8, this.getViewCenter());
      this.graph.get('canvas').set('localRefresh', false); // 解决拖拽的残影问题
    },
    getFormatPadding() {
      return Util.formatPadding(this.graph.get('fitViewPadding'));
    },
    getViewCenter() {
      const padding = this.getFormatPadding();
      const graph = this.graph;
      const width = graph.get('width');
      const height = graph.get('height');
      return {
        x: (width - padding[2] - padding[3]) / 2 + padding[3],
        y: (height - padding[0] - padding[2]) / 2 + padding[0]
      };
    },
  },
};
</script>

<style scoped>
  .page{
    margin-right: 200px;
  }
</style>