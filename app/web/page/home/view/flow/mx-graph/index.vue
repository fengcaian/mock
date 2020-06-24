<template>
  <div>
    <toolbar></toolbar>
    <div id="graphContainer"></div>
  </div>
</template>

<script>
import mxgraph from '../../../../../../web/framework/utils/common/mx-graph';
import toolbar from './components/toolbar';

export default {
  components: {
    toolbar
  },
  data() {
    return {
      mxGraph: null,
    };
  },
  created() {
    this.mxGraph = mxgraph;
  },
  mounted() {
    // this.draw();
  },
  methods: {
    draw() {
      if (!this.mxGraph.mxClient.isBrowserSupported()) {
        // 判断是否支持mxgraph
        this.mxGraph.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        // 再容器中创建图表
        let container = document.getElementById('graphContainer');
        let MxGraph = this.mxGraph.mxGraph;
        let MxCodec = this.mxGraph.mxCodec;
        var graph = new MxGraph(container);
        // 生成 Hello world!
        var parent = graph.getDefaultParent();
        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 200, 80, 30, 'ROUNDED;strokeColor=red;fillColor=green');
          var v2 = graph.insertVertex(parent, null, 'World', 200, 150, 80, 30);
          var v3 = graph.insertVertex(parent, null, 'everyBody!', 300, 350, 60, 60);
          graph.insertEdge(parent, null, '', v1, v2);
          graph.insertEdge(parent, null, '', v2, v3);
          graph.insertEdge(parent, null, '', v1, v3);
        } finally {
          // Updates the display
          graph.getModel().endUpdate();
        }
        // 打包XML文件
        let encoder = new MxCodec();
        let xx = encoder.encode(graph.getModel());
        // 保存到getXml参数中
        this.getXml = this.mxGraph.mxUtils.getXml(xx);
      }
    },
    util(node) {}
  },
}
</script>

<style scoped>

</style>