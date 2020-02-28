<template>
  <div>
    <tool-bar v-if="isShowToolBar" @graphSelect="graphSelect"></tool-bar>
    <div class="svg-container" :style="`transform: scale(${scaleX}, ${scaleY})`">
      <svg
          id="svg-chain"
          ref="svg-chain"
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
          style="width: 100%; height: 100vh"
          @mousemove="!isActive && mousemoveSvg($event)">
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
      isShowToolBar: false,
      isShowInductor: false,
      isActive: false,
      scaleX: 1,
      scaleY: 1,
      svgHeight: 1,
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
      this.isShowToolBar = true;
      // this.isShowInductor = true;
      this.isActive = true;
    },
    graphSelect(graphType) {
      this.isShowToolBar = false;
      this.isActive = false;
      this.chainArray.push(this.getGraph(graphType));
    },
    getGraph(params) {
      const type = '';
      const graph = JSON.parse(JSON.stringify(this.graphics));
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
</style>dui