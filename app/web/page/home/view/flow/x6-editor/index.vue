<template>
  <div>
    <x6-editor :data="x6Data"></x6-editor>
    <!--<el-button type="primary" size="mini" @click="scale">缩放</el-button>-->
    <!--<el-button type="primary" size="mini" @click="translate">平移</el-button>-->
    <!--<el-button type="primary" size="mini" @click="addNode">add node</el-button>-->
    <!--<el-button type="primary" size="mini" @click="addEdge">add edge</el-button>-->
    <!--<el-button type="primary" size="mini" @click="getData">获取数据</el-button>-->
  </div>
</template>

<script>
import { Graph, Shape, Addon } from '@antv/x6';
import x6Editor from './../../../../../component/x6-editor'

export default {
  components: {
    x6Editor
  },
  data() {
    return {
      x6Data: {
        // 节点
        nodes: [
          {
            id: 'node1', // String，可选，节点的唯一标识
            x: 40,       // Number，必选，节点位置的 x 值
            y: 40,       // Number，必选，节点位置的 y 值
            width: 80,   // Number，可选，节点大小的 width 值
            height: 40,  // Number，可选，节点大小的 height 值
            label: 'hello', // String，节点标签
            attrs: {
              body: {
                fill: '#2ECC71',
                stroke: '#000',
                strokeDasharray: '10,2',
              },
              label: {
                text: 'Hello',
                fill: '#333',
                fontSize: 13,
              },
            },
            markup: [
              {
                tagName: 'rect',
                selector: 'body',
              },
              {
                tagName: 'text',
                selector: 'label',
              },
            ],
            ports: [
              {
                id: 'port1',
                attrs: {
                  circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    fill: '#fff',
                  },
                },
              },
              {
                id: 'port2',
                attrs: {
                  circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    fill: '#fff',
                  },
                },
              },
              {
                id: 'port3',
                attrs: {
                  circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    fill: '#fff',
                  },
                },
              },
            ],
          },
          {
            id: 'node2', // String，节点的唯一标识
            shape: 'circle',
            x: 160,      // Number，必选，节点位置的 x 值
            y: 180,      // Number，必选，节点位置的 y 值
            width: 80,   // Number，可选，节点大小的 width 值
            height: 40,  // Number，可选，节点大小的 height 值
            label: 'world', // String，节点标签
            attrs: {
              body: {
                fill: '#F39C12',
                stroke: '#000',
                rx: 16,
                ry: 16,
              },
              label: {
                text: 'World',
                fill: '#333',
                fontSize: 18,
                fontWeight: 'bold',
                fontVariant: 'small-caps',
              },
            },
          },
          {
            id: 'node3',
            shape: 'ellipse', // 使用 ellipse 渲染
            x: 300,
            y: 200,
            width: 80,
            height: 40,
            label: 'world',
            attrs: {
              body: {
                fill: '#F39C12',
                stroke: '#000',
                rx: 16,
                ry: 16,
              },
              label: {
                text: 'World',
                fill: '#333',
                fontSize: 18,
                fontWeight: 'bold',
                fontVariant: 'small-caps',
              },
            },
          },
          {
            id: 'node4',
            x: 400,
            y: 300,
            width: 80,
            height: 40,
            label: 'world33333',
            attrs: {
              body: {
                fill: '#F39C12',
                stroke: '#000',
                rx: 16,
                ry: 16,
              },
              label: {
                text: 'World33',
                fill: '#333',
                fontSize: 18,
                fontWeight: 'bold',
                fontVariant: 'small-caps',
              },
              visible: false,
            },
            visible: false,
          },
        ],
        // 边
        edges: [
          {
            source: {
              cell: 'node1',
              port: 'port1',
            }, // String，必须，起始节点 id
            target: {
              cell: 'node2',
            }, // String，必须，目标节点 id
            attrs: {
              line: {
                stroke: '#7c68fc', // 指定 path 元素的填充色
                strokeWidth: 1,
              },
            },
            router: 'metro',
          },
          {
            source: 'node2', // String，必须，起始节点 id
            target: 'node3', // String，必须，目标节点 id
            shape: 'shadow-edge',
            router: 'manhattan',
          },
          {
            source: 'node3', // String，必须，起始节点 id
            target: 'node4', // String，必须，目标节点 id
            attrs: {
              line: {
                stroke: 'orange',
              },
            },
            router: 'orth',
            connector: 'rounded',
            label: 'edge',
          },
        ],
      },
      graph: null,
      dnd: null,
    };
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
    scale() {
      this.graph.scale(0.5, 0.5);
    },
    translate() {
      this.graph.translate(80, 40);
    },
    addNode() {
      const rect = new Shape.Rect({
        id: 'node6',
        x: 60,
        y: 90,
        width: 100,
        height: 40,
        label: 'rect',
        zIndex: 2,
      });
      this.graph.addNode(rect);
    },
    addEdge() {},
    getData() {
      console.log(this.graph.getCells());
    },
  },
};
</script>
<style scoped>

</style>
