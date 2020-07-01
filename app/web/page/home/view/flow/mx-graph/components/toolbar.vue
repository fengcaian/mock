<template>
  <div>
    <div id="toolbar" class="toolbar"></div>
    <div id="wrap" class="wrap"></div>
  </div>
</template>

<script>
import mxgraph from '../../../../../../../web/framework/utils/common/mx-graph';

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
    this.init();
  },
  methods: {
    init() {
      this.mxGraph.mxConnectionHandler.prototype.connectImage = new this.mxGraph.mxImage(require('../../../../../../../web/asset/images/connector.gif'), 16, 16);
      if (!this.mxGraph.mxClient.isBrowserSupported()) {
        this.mxGraph.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        const tbContainer = document.getElementById('toolbar');
        var toolbar = new this.mxGraph.mxToolbar(tbContainer);
        toolbar.enabled = false
        const container = document.getElementById('wrap');
        // Workaround for Internet Explorer ignoring certain styles
        if (this.mxGraph.mxClient.IS_QUIRKS) {
          document.body.style.overflow = 'hidden';
          new this.mxGraph.mxDivResizer(tbContainer);
          new this.mxGraph.mxDivResizer(container);
        }
        var model = new this.mxGraph.mxGraphModel();
        var graph = new this.mxGraph.mxGraph(container, model);
        graph.dropEnabled = true;

        // Matches DnD inside the graph
        this.mxGraph.mxDragSource.prototype.getDropTarget = function(graph, x, y) {
          var cell = graph.getCellAt(x, y);

          if (!graph.isValidDropTarget(cell))
          {
            cell = null;
          }

          return cell;
        };

        // Enables new connections in the graph
        graph.setConnectable(true);
        graph.setMultigraph(false);

        // graph.addListener('click', () => {
        //   console.log(111);
        //   console.log(this);
        // });

        graph.dblClick = function() {
          console.log(33);
          console.log(this);
        };

        // Stops editing on enter or escape keypress
        var keyHandler = new this.mxGraph.mxKeyHandler(graph);
        var rubberband = new this.mxGraph.mxRubberband(graph);

        var addVertex = (icon, w, h, style) => {
          var vertex = new this.mxGraph.mxCell(null, new this.mxGraph.mxGeometry(0, 0, w, h), style);
          vertex.setVertex(true);

          this.addToolbarItem(graph, toolbar, vertex, icon);
        };

        addVertex(require('../../../../../../../web/asset//images/swimlane.gif'), 120, 160, 'shape=swimlane;startSize=20;');
        addVertex(require('../../../../../../../web/asset/images/rectangle.gif'), 100, 40, '');
        addVertex(require('../../../../../../../web/asset/images/rounded.gif'), 100, 40, 'shape=rounded');
        addVertex(require('../../../../../../../web/asset/images/ellipse.gif'), 40, 40, 'shape=ellipse');
        addVertex(require('../../../../../../../web/asset/images/rhombus.gif'), 40, 40, 'shape=rhombus');
        addVertex(require('../../../../../../../web/asset/images/triangle.gif'), 40, 40, 'shape=triangle');
        addVertex(require('../../../../../../../web/asset/images/cylinder.gif'), 40, 40, 'shape=cylinder');
        addVertex(require('../../../../../../../web/asset/images/actor.gif'), 30, 40, 'shape=actor');
        // toolbar.addLine();
        toolbar.addListener('click', function () {
          console.log(555);
        });
        toolbar.addListener('drag', function () {
          console.log(123);
        });

        var button = this.mxGraph.mxUtils.button('Create toolbar entry from selection', (evt) => {
          if (!graph.isSelectionEmpty()) {
            // Creates a copy of the selection array to preserve its state
            var cells = graph.getSelectionCells();
            var bounds = graph.getView().getBounds(cells);

            // Function that is executed when the image is dropped on
            // the graph. The cell argument points to the cell under
            // the mousepointer if there is one.
            var funct = function(graph, evt, cell) {
              graph.stopEditing(false);

              var pt = graph.getPointForEvent(evt);
              var dx = pt.x - bounds.x;
              var dy = pt.y - bounds.y;

              graph.setSelectionCells(graph.importCells(cells, dx, dy, cell));
            }

            // Creates the image which is used as the drag icon (preview)
            var img = toolbar.addMode(null, require('../../../../../../../web/asset/images/outline.gif'), funct);
            this.mxGraph.mxUtils.makeDraggable(img, graph, funct);
          }
        });

        button.style.position = 'absolute';
        button.style.left = '2px';
        button.style.top = '2px';

        document.body.appendChild(button);
      }
    },
    addToolbarItem(graph, toolbar, prototype, image) {
      var funct = function(graph, evt, cell) {
        graph.stopEditing(false);

        var pt = graph.getPointForEvent(evt);
        var vertex = graph.getModel().cloneCell(prototype);
        vertex.geometry.x = pt.x;
        vertex.geometry.y = pt.y;
        console.log(pt);

        graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
      }

      // Creates the image which is used as the drag icon (preview)
      var img = toolbar.addMode(null, image, funct, '', '', function() {
        console.log(33333);
        console.log(this);
      });
      this.mxGraph.mxUtils.makeDraggable(img, graph, funct);
    },
  },
}
</script>

<style scoped>
  .toolbar {
    position: absolute;
    overflow: hidden;
    padding: 2px;
    left: 0;
    top: 26px;
    width: 24px;
    bottom: 0;
  }
  .wrap {
    position: absolute;
    overflow: hidden;
    left: 24px;
    top: 26px;
    right: 0;
    bottom: 0;
    background: url("../../../../../../../web/asset/images/grid.gif");
  }
</style>