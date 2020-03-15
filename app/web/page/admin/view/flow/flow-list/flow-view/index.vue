<template>
  <div>
    <tool-bar v-if="isShowToolBar" @graphSelect="graphSelect" @dragStart="dragStart"></tool-bar>
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
          @click="installSvg">
          <defs>
            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#CCCCCC" stroke-width="0.5"/>
            </pattern>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="url(#smallGrid)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        <!--<svg-line :position="{x: 250, y: 250}" :length="50" direction="right" :arrow="true"></svg-line>-->
        <!--<svg-line :position="{x: 250, y: 250}" :length="150" direction="left" :arrow="true"></svg-line>-->
        <!--<svg-line :position="{x: 250, y: 250}" :length="150" direction="up" :arrow="true"></svg-line>-->
        <!--<svg-line :position="{x: 250, y: 250}" :length="150" direction="down" :arrow="true"></svg-line>-->
        <!--<svg-rect :position="{x: 250, y: 250}"></svg-rect>-->
        <g v-for="(svg, index) in chainArray" :key="index">
          <svg-line v-if="svg.type === 'line'" :position="svg.data.position" :length="svg.data.length" :direction="svg.data.direction" :arrow="svg.data.arrow"></svg-line>
          <svg-rect v-else-if="svg.type === 'rect'" :position="svg.data.position" :size="svg.data.size"></svg-rect>
        </g>
        <g @click="inductorClick">
          <svg-inductor v-if="isShowInductor" :cycle="inductorArea"></svg-inductor>
        </g>
        <g>
          <svg-line v-if="activeSvg === 'line-up'" :position="mousePosition" :length="40" direction="up" :arrow="true"></svg-line>
          <svg-line v-if="activeSvg === 'line-right'" :position="mousePosition" :length="40" direction="right" :arrow="true"></svg-line>
          <svg-line v-if="activeSvg === 'line-down'" :position="mousePosition" :length="40" direction="down" :arrow="true"></svg-line>
          <svg-line v-if="activeSvg === 'line-left'" :position="mousePosition" :length="40" direction="left" :arrow="true"></svg-line>
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
      activeSvg: '',
      mousePosition: {
        x: 0,
        y: 0,
      },
      chainArray: [
        {
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
      this.activeSvg = graphId;
    },
    dragStart() {},
    installSvg() {
      if (this.activeSvg) {
        this.chainArray.push(this.getGraph(this.activeSvg));
      }
      console.log(this.chainArray);
    },
    getGraph(params) {
      let type = '';
      if (/^(line).*/.test(params)) {
        type = 'line';
      }
      if (/^(rect).*/.test(params)) {
        type = 'rect';
      }
      const graph = JSON.parse(JSON.stringify(this.graphics[type]));
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
      this.activeSvg = '';
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