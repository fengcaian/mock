<template>
  <div>
    <tool-bar
        v-if="isShowToolBar"
        @graphSelect="graphSelect">
    </tool-bar>
    <div class="svg-container" :style="`transform: scale(${scaleX}, ${scaleY})`">
      <svg
          id="svg-chain"
          ref="svg-chain"
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
          style="width: 100%; height: 100vh"
          @contextmenu="preventRightClick"
          @mousemove="!isActive && mousemoveSvg($event)"
          @click="svgClick">
          <defs>
            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#CCCCCC" stroke-width="0.5"/>
            </pattern>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="url(#smallGrid)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        <g v-for="(svg, index) in chainArray" :key="index" @click.stop="selectShape(svg, index)">
          <svg-line v-if="svg.type === 'line'" :position="svg.data.position" :length="svg.data.length" :stroke="svg.data.stroke" :direction="svg.data.direction" :arrow="svg.data.arrow"></svg-line>
          <svg-rect v-else-if="svg.type === 'rect'" :id="svg.id" :position="svg.data.position" :stroke="svg.data.stroke" :size="svg.data.size"></svg-rect>
        </g>
        <g @click="inductorClick">
          <svg-inductor v-if="isShowInductor" :cycle="inductorArea"></svg-inductor>
        </g>
        <g>
          <div>
            <text x="0" y="15" fill="red">I love SVG</text>
          </div>
          <path :x1="cursor.x1" :y1="cursor.y1" :x2="cursor.x2" :y2="cursor.y2" strok-width="1"></path>
        </g>
        <g>
          <svg-line v-if="tempSvgInfo.type === 'line-up'" :position="mousePosition" :length="70" direction="up" :arrow="true"></svg-line>
          <svg-line v-if="tempSvgInfo.type === 'line-right'" :position="mousePosition" :length="70" direction="right" :arrow="true"></svg-line>
          <svg-line v-if="tempSvgInfo.type === 'line-down'" :position="mousePosition" :length="70" direction="down" :arrow="true"></svg-line>
          <svg-line v-if="tempSvgInfo.type === 'line-left'" :position="mousePosition" :length="70" direction="left" :arrow="true"></svg-line>
          <svg-rect v-if="tempSvgInfo.type === 'rect'" :position="mousePosition" :size="{width: 100, height: 60}"></svg-rect>
        </g>
      </svg>
    </div>
    <div class="zoom">
      <el-button-group>
        <el-button type="primary" size="mini" icon="el-icon-zoom-in" @click="zoomIn"></el-button>
        <el-button type="primary" size="mini" icon="el-icon-zoom-out" @click="zoomOut"></el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import svgLine from '../components/line';
import svgRect from '../components/rectangle';
import svgInductor from '../components/inductor';

import toolBar from '../components/tool-bar';

export default {
  components: {
    svgLine,
    svgRect,
    svgInductor,
    toolBar,
  },
  data() {
    return {
      isShowToolBar: true,
      isShowInductor: false,
      isActive: false,
      scaleX: 1,
      scaleY: 1,
      svgHeight: 1,
      tempSvgInfo: {},
      movingNode: null,
      movingNodeId: null,
      mousePosition: {
        x: 0,
        y: 0,
      },
      chainArray: [
        {
          id: `line-${Math.random()}`,
          type: 'line',
          data: {
            position: {
              x: 100,
              y: 100,
            },
            length: 70,
            direction: 'down',
            arrow: true,
          },
        },
        {
          id: `rect-${Math.random()}`,
          type: 'rect',
          data: {
            position: {
              x: 50,
              y: 170,
            },
            size: {
              width: 100,
              height: 60,
            }
          },
        }
      ],
      graphics: {
        line: {
          id: `line-${Math.random()}`,
          type: 'line',
          data: {
            position: {
              x: 100,
              y: 100,
            },
            length: 70,
            direction: 'down',
            arrow: true,
          },
        },
        rect: {
          id: `rect-${Math.random()}`,
          type: 'rect',
          data: {
            position: {
              x: 50,
              y: 170,
            },
            size: {
              width: 100,
              height: 60,
            }
          },
        }
      },
      inductorArea: {
        type: 'cycle',
        r: 5,
        x: 6,
        y: 6,
        positionList: [
          {
            x: 10,
            y: 10,
          }
        ],
      },
      activeInductorPos: null,
      selectedShape: null,
      selectedShapeIndex: null,
      cursor: {
        x1: 0,
        y1: 0,
        x2: 10,
        y2: 10,
      },
    };
  },
  watch: {
    chainArray(val) {
      this.inductorArea.positionList = this.getInductorAreaList(val);
    },
  },
  created() {
    this.inductorArea.positionList = this.getInductorAreaList(this.chainArray);
    console.log(this.inductorArea);
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 8 && this.selectedShape && this.selectedShapeIndex) {
        this.chainArray.splice(this.selectedShapeIndex, 1);
        this.selectedShape = null;
        this.selectedShapeIndex = null;
      }
    }, false);
  },
  methods: {
    mousemoveSvg(e) {
      this.mousePosition = {
        x: e.offsetX,
        y: e.offsetY,
      };
      const inductorArea = this.getInductorArea(e.offsetX, e.offsetY);
      if (inductorArea) {
        this.isShowInductor = true;
        this.inductorArea.x = inductorArea.x;
        this.inductorArea.y = inductorArea.y;
        this.activeInductorPos = {
          x: inductorArea.x,
          y: inductorArea.y,
        };
        console.log(`i am in inductor area,x:${inductorArea.x},y:${inductorArea.y}`);
      } else {
        this.isShowInductor = false;
      }
    },
    inductorClick() {
      // this.isShowToolBar = true;
      // this.isShowInductor = true;
      this.isActive = true;
    },
    graphSelect(graphId) {
      // this.isShowToolBar = false;
      this.isActive = false;
      this.tempSvgInfo = {
        type: graphId,
      };
      console.log(graphId);
    },
    selectShape(shape, i) {
      if (this.selectedShape && this.selectedShapeIndex) {
        this.selectedShape.data.stroke = 'rgb(79, 136, 186)';
        this.$set(this.chainArray, this.selectedShapeIndex, this.selectedShape);
      }
      shape.data.stroke = 'red';
      this.selectedShape = shape;
      this.selectedShapeIndex = i;
      this.$set(this.chainArray, i, shape);
    },
    dragStart() {
      console.log(11);
    },
    mouseDown(node, type) {
      this.movingNode = node;
      node.id = `${type}-${Math.random()}`;
      this.movingNodeId = `${type}-${Math.random()}`;
      this.$refs['svg-chain'].appendChild(node);
    },
    mouseMove(e) {
      this.movingNode = document.getElementById(this.movingNodeId);
      this.movingNode.x = e.offsetX;
      this.movingNode.y = e.offsetY;
    },
    svgClick(e) {
      if (this.tempSvgInfo.type) {
        let svg = this.getGraph(this.tempSvgInfo);
        if (svg.type === 'rect') {
          svg.data.position = {
            x: e.offsetX,
            y: e.offsetY,
          };
        } else {
          svg.data.position = this.activeInductorPos;
        }
        this.chainArray.push(svg);
        this.tempSvgInfo = {};
        this.activeInductorPos = null;
      }
      if (this.selectedShape) {
        this.selectedShape.data.stroke = 'rgb(79, 136, 186)';
        this.$set(this.chainArray, this.selectedShapeIndex, this.selectedShape);
        this.selectedShape = null;
        this.selectedShapeIndex = null;
      }
    },
    getGraph(params) {
      let type = '';
      let direction = '';
      if (/^(line).*/.test(params.type)) {
        type = 'line';
        direction = params.type.split('-')[1] || 'down';
      }
      if (/^(rect).*/.test(params.type)) {
        type = 'rect';
      }
      const graph = JSON.parse(JSON.stringify(this.graphics[type]));
      graph.data.direction = direction;
      return graph;
    },
    getInductorArea(x, y) {
      if (!this.inductorArea.positionList.length) {
        return undefined;
      }
      return this.inductorArea.positionList.find((position) => {
        if (this.inductorArea.r * this.inductorArea.r >= (x - position.x) * (x - position.x) + (y - position.y) * (y - position.y)) {
          return position;
        }
      });
    },
    getInductorAreaList(arr) {
      const list = [];
      let data = {};
      arr.forEach((item) => {
        if (item.type === 'rect') {
          data = item.data;
          list.push(
            {
              x: data.position.x + (data.size.width / 2),
              y: data.position.y,
            },
            {
              x: data.position.x + data.size.width,
              y: data.position.y + (data.size.height / 2),
            },
            {
              x: data.position.x + (data.size.width / 2),
              y: data.position.y + data.size.height,
            },
            {
              x: data.position.x,
              y: data.position.y + (data.size.height / 2),
            }
          );
        }
      });
      return list;
    },
    preventRightClick(e) {
      e.preventDefault();
      this.tempSvgInfo = {};
    },
    zoomIn() {
      this.scaleX /= 0.9;
      this.scaleY /= 0.9;
      this.svgHeight /= 0.9;
    },
    zoomOut() {
      this.scaleX *= 0.9;
      this.scaleY *= 0.9;
      this.svgHeight *= 0.9;
    },
  },
}
</script>

<style scoped>
  .svg-container {
    transform-origin: left top;
  }
  .zoom {
    position: absolute;
    right: 5%;
    bottom: 75px;
  }
</style>