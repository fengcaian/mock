<template>
  <div id="navigator">
    <div class="panel-title">导航器</div>
    <div id="minimap" class="minimap" ref="minimap"></div>
  </div>
</template>

<script>
import { Minimap } from '@antv/g6';
import eventBus from './../../framework/utils/common/eventBus';

export default {
  data() {
    return {
      minimap: null,
      graph: null
    };
  },
  created() {
    this.bindEvent();
  },
  mounted() {
    this.$nextTick(() => {
      this.initMiniMap();
    });
  },
  destroyed() {
    eventBus.$off('afterAddPage');
  },
  methods: {
    initMiniMap() {
      const cfgs = {
        container: 'minimap'
      };
      this.minimap = new Minimap({ ...cfgs });
    },
    bindEvent() {
      const self = this;
      eventBus.$on('afterAddPage', page => {
        self.graph = page.graph;
        self.bindPage();
      });
    },
    bindPage() {
      if (!this.minimap || !this.graph) {
        return;
      }
      this.graph.addPlugin(this.minimap);
    }
  }
}
</script>

<style scoped>
  #navigator {
    width: 200px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 3;
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
</style>