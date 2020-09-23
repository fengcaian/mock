<template>
  <div>
    <div class="left">
      <div>
        <div class="rect" @mousedown="dragStart($event)"></div>
      </div>
    </div>
    <div class="center" id="container"></div>
    <div class="right"></div>
  </div>
</template>

<script>
import { Graph, Shape, Addon } from '@antv/x6';

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      x6Data: null,
      graph: null,
      dnd: null,
    };
  },
  created() {
    this.x6Data = this.data;
  },
  mounted() {
    this.graph = new Graph({
      container: document.getElementById('container'),
      width: 800,
      height: 600,
      background: {
        color: '#fffbe6', // 设置画布背景颜色
      },
      grid: {
        size: 10,      // 网格大小 10px
        visible: true, // 渲染网格背景
      },
    });
    this.graph.fromJSON(this.x6Data);
    this.dnd = new Addon.Dnd({ target: this.graph, animation: true });
  },
  methods: {
    dragStart(e) {
      const target = e.currentTarget;
      const type = target.getAttribute('data-type');
      let node = null;
      if (type === 'rect') {
        node = new Shape.Rect({
          width: 100,
          height: 40,
          attrs: {
            label: {
              text: 'Rect',
              fill: '#6a6c8a',
            },
            body: {
              stroke: '#31d0c6',
              strokeWidth: 2,
            },
          },
        });
      } else {
        node = new Shape.Circle({
          width: 60,
          height: 60,
          attrs: {
            label: {
              text: 'Circle',
              fill: '#6a6c8a',
            },
            body: {
              stroke: '#31d0c6',
              strokeWidth: 2,
            },
          },
        });
      }
      this.dnd.start(node, e);
    },
  },
}
</script>

<style scoped>
  .left{
    display: inline-block;
    width: 200px;
    height: 100vh;
  }
  .center{
    display: inline-block;
    height: 100vh;
  }
  .rect{
    width: 80px;
    height: 60px;
    border: 1px solid yellowgreen;
    background: antiquewhite;
  }
</style>