<template>
  <div id="g6Container"></div>
</template>

<script>
import G6 from '@antv/g6';

export default {
  data() {
    return {
      g6Data: {
        nodes: [
          {
            id: 'node1',
            x: 100,
            y: 200,
          },
          {
            id: 'node2',
            x: 300,
            y: 200,
          }
        ],
        defaultNode: {
          position: 'left',
          style: {
            background: {
              fill: '#ffffff',
              stroke: 'green',
              padding: [3, 2, 3, 2],
              radius: 2,
              lineWidth: 3,
            },
          },
        },
        edges: [
          {
            source: 'node1',
            target: 'node2',
          }
        ],
        defaultEdge: {
          autoRotate: true,
          style: {
            background: {
              fill: '#ffffff',
              stroke: '#000000',
              padding: [2, 2, 2, 2],
              radius: 2,
            },
          },
        }
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const graph = new G6.Graph({
        container: 'g6Container',
        width: 800,
        height: 600,
      });
      graph.data(this.g6Data);
      graph.render();
    },
  },
}
</script>

<style scoped>

</style>