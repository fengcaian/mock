<template>
  <div class="page">
    <div :id="pageId" class="graph-container" style="position: relative;"></div>
  </div>
</template>

<script>
import G6 from '@antv/g6';
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
        id: '123',
        container: 'graph-container',
        height: height,
        width: width,
        modes: {
          // 支持的 behavior
          default: [
            'zoom-canvas',
            'click-node',
            'keyboard',
            'customer-events',
            'add-menu'
          ],
          multiSelect: ['multi-select'],
          addEdge: ['add-edge'],
          moveNode:[ 'drag-item'],
          moveEdge:[ 'drag-edge'],
          edit: ['hover-node', 'select-node', 'hover-edge', 'select-edge', 'drag-canvas'],
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
      console.log(this.data);
      let data = this.data;
      if (data) {
        this.graph.read(data);
        // this.graph.get('canvas').set('localRefresh', false); // 解决拖拽的残影问题
      }
    },
  },
};
</script>

<style scoped>
  .page{
    margin-right: 200px;
  }
</style>