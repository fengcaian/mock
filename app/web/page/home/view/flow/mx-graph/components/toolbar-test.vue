<template>
  <div ref="container" class="graphContainer">
  </div>
</template>

<script>
import mxgraph from '../../../../../../../web/framework/utils/common/mx-graph';

export default {
  name: 'HelloWorld',
  data() {
    return {
      model: null,
      graph: null,
      mxGraph: null,
    }
  },
  created() {
    this.mxGraph = mxgraph;
  },
  mounted() {
    // 创建一个div作为toolbar的容器
    let tbContainer = document.createElement('div')

    tbContainer.style.position = 'absolute'
    tbContainer.style.overflow = 'hidden'
    tbContainer.style.padding = '2px'
    tbContainer.style.left = '0px'
    tbContainer.style.top = '0px'
    tbContainer.style.width = '24px'
    tbContainer.style.bottom = '0px'
    this.$refs.container.appendChild(tbContainer)
    // 创建一个mxToolbar
    let toolbar = new this.mxGraph.mxToolbar(tbContainer)

    toolbar.enabled = false
    // 创建一个div作为graph的容器
    let container = document.createElement('div')

    container.style.position = 'absolute'
    container.style.overflow = 'hidden'
    container.style.left = '24px'
    container.style.top = '0px'
    container.style.right = '0px'
    container.style.bottom = '0px'
    container.style.background = 'url("../../../../../../../web/asset/images/grid.gif")'
    this.$refs.container.appendChild(container)
    this.model = new this.mxGraph.mxGraphModel()
    this.graph = new this.mxGraph.mxGraph(container, this.model)
    this.graph.setConnectable(true)
    this.graph.setMultigraph(false)

    let addVertex = (icon, w, h, style) => {
      let vertex = new this.mxGraph.mxCell(null, new this.mxGraph.mxGeometry(0, 0, w, h), style)

      vertex.setVertex(true)
      let img = this.addToolbarItem(this.graph, toolbar, vertex, icon)

      img.enabled = true
      this.graph.getSelectionModel().addListener(this.mxGraph.mxEvent.CHANGE, () => {
        let tmp = this.graph.isSelectionEmpty()

        this.mxGraph.mxUtils.setOpacity(img, (tmp) ? 100 : 20)
        img.enabled = tmp
      })
    }

    addVertex(require('../../../../../../../web/asset//images/swimlane.gif'), 120, 160, 'shape=swimlane;startSize=20;');
    addVertex(require('../../../../../../../web/asset/images/rectangle.gif'), 100, 40, '');
    addVertex(require('../../../../../../../web/asset/images/rounded.gif'), 100, 40, 'shape=rounded');
    addVertex(require('../../../../../../../web/asset/images/ellipse.gif'), 40, 40, 'shape=ellipse');
    addVertex(require('../../../../../../../web/asset/images/rhombus.gif'), 40, 40, 'shape=rhombus');
    addVertex(require('../../../../../../../web/asset/images/triangle.gif'), 40, 40, 'shape=triangle');
    addVertex(require('../../../../../../../web/asset/images/cylinder.gif'), 40, 40, 'shape=cylinder');
    addVertex(require('../../../../../../../web/asset/images/actor.gif'), 30, 40, 'shape=actor');
  },
  methods: {
    addToolbarItem(graph, toolbar, prototype, image) {
      let funct = function (graph, evt, cell, x, y) {
        graph.stopEditing(false)
        let vertex = graph.getModel().cloneCell(prototype)

        vertex.geometry.x = x
        vertex.geometry.y = y

        graph.addCell(vertex)
        graph.setSelectionCell(vertex)
      }
      let img = toolbar.addMode(null, image, function (evt, cell) {
        let pt = this.graph.getPointForEvent(evt)

        funct(graph, evt, cell, pt.x, pt.y)
      })

      this.mxGraph.mxEvent.addListener(img, 'mousedown', function (evt) {
        if (img.enabled === false) {
          this.mxGraph.mxEvent.consume(evt)
        }
      })
      this.mxGraph.mxUtils.makeDraggable(img, graph, funct)
      return img
    }
  },
}
</script>
