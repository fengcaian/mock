<template>
  <div>
    <div id="test"></div>
  </div>
</template>

<script>
import mxgraph from '../../../../../../web/framework/utils/common/mx-graph';

export default {
  data() {
    return {
      mxGraph: null,
    };
  },
  created() {
    this.mxGraph = mxgraph;
  },
  mounted() {
    this.main();
  },
  methods: {
    main() {
      // 设置一个创建新连接的图标
      this.mxGraph.mxConnectionHandler.prototype.connectImage = new this.mxGraph.mxImage(require('../../../../../../web/asset/images/connector.gif'),14,14);

      // 检查浏览器支持
      if (!this.mxGraph.mxClient.isBrowserSupported()) {
        this.mxGraph.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        var container = document.getElementById('test');
        container.style.position = 'absolute';
        container.style.overflow = 'hidden';
        container.style.left = '0px';
        container.style.top = '0px';
        container.style.right = '0px';
        container.style.bottom = '0px';
        container.style.background = 'url("../../../../../../web/asset/images/grid.gif")';

        // 禁用内置右键下拉菜单
        this.mxGraph.mxEvent.disableContextMenu(container);

        // 修复Internet Explorer忽略的样式
        if (this.mxGraph.mxClient.IS_QUIRKS) {
          document.body.style.overflow = 'hidden';
          new this.mxGraph.mxDivResizer(container);
        }

        // 在容器中创建图形
        var graph = new this.mxGraph.mxGraph(container);

        // 启用工具提示，新连接平滑移动
        graph.setPanning(true);
        graph.setTooltips(true);
        graph.setConnectable(true);

        // 自动处理平行边
        var layout = new this.mxGraph.mxParallelEdgeLayout(graph);
        var layoutMgr = new this.mxGraph.mxLayoutManager(graph);

        layoutMgr.getLayout = function(cell) {
          if (cell.getChildCount() > 0) {
            return layout;
          }
        }
        ;

        // 启动鼠标悬停提示
        var rubberband = new this.mxGraph.mxRubberband(graph);
        var keyHandler = new this.mxGraph.mxKeyHandler(graph);

        // 设置连接线选择的样式
        var style = graph.getStylesheet().getDefaultEdgeStyle();
        style[this.mxGraph.mxConstants.STYLE_ROUNDED] = true;
        style[this.mxGraph.mxConstants.STYLE_EDGE] = this.mxGraph.mxEdgeStyle.ElbowConnector;

        graph.alternateEdgeStyle = 'elbow=vertical';

        // 安装一个自定义的工具提示单元格
        graph.getTooltipForCell = function(cell) {
          return 'Doubleclick and right- or shiftclick';
        }

        // 安装右键点击处理程序
        graph.panningHandler.factoryMethod = function(menu, cell, evt) {
          return this.mxGraph.createPopupMenu(graph, menu, cell, evt);
        }
        ;

        //在图形中创建默认组件
        var parent = graph.getDefaultParent();

        // 开启更新事务
        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(parent, null, 'Doubleclick', 20, 20, 80, 30);
          var v2 = graph.insertVertex(parent, null, 'Right-/Shiftclick', 200, 150, 120, 30);
          var v3 = graph.insertVertex(parent, null, 'Connect/Reconnect', 200, 20, 120, 30);
          var v4 = graph.insertVertex(parent, null, 'Control-Drag', 20, 150, 100, 30);
          var e1 = graph.insertEdge(parent, null, 'Tooltips', v1, v2);
          var e2 = graph.insertEdge(parent, null, '', v2, v3);
        } finally {
          // 结束更新事务
          graph.getModel().endUpdate();
        }
      }
    },
    createPopupMenu(graph, menu, cell, evt) {
      if (cell != null) {
        menu.addItem('Cell Item', require('../../../../../../web/asset//images/swimlane.gif'), function() {
          this.mxGraph.mxUtils.alert('MenuItem1');
        });
      } else {
        menu.addItem('No-Cell Item', require('../../../../../../web/asset//images/ellipse.gif'), function() {
          this.mxGraph.mxUtils.alert('MenuItem2');
        });
      }
      menu.addSeparator();
      menu.addItem('MenuItem3', require('../../../../../../web/asset//images/rhombus.gif'), function() {
        this.mxGraph.mxUtils.alert('MenuItem3: ' + graph.getSelectionCount() + ' selected');
      });
    },
  },
}
</script>

<style scoped>

</style>