<template>
  <div>
    <!--<tool-bar-->
        <!--v-if="isShowToolBar"-->
        <!--@graphSelect="graphSelect">-->
    <!--</tool-bar>-->
    <tool-bar-t
        v-if="isShowToolBar"
        @graphSelect="graphSelect">
    </tool-bar-t>
    <div class="svg-container" :style="`transform: scale(${scaleX}, ${scaleY})`">
      <svg
          id="svg-chain"
          ref="svg-chain"
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
          pointer-events="visible"
          style="width: 100%; height: 100vh;"
          :style="{cursor: customDrawing ? cursor[customDrawType] : ''}"
          @contextmenu="preventRightClick"
          @mousedown="mouseDown($event)"
          @mousemove="!isActive && mousemoveSvg($event)"
          @mouseup="mouseUp($event)"
          @click="svgClick">
          <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#CCCCCC" stroke-width="0.5"/>
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        <g v-for="(svg, index) in chainArray" :key="index" @click.stop="selectShape(svg, index)">
          <svg-line v-if="svg.type === 'line'" :position="svg.data.position" :length="svg.data.length" :stroke="svg.data.stroke" :direction="svg.data.direction" :arrow="svg.data.arrow"></svg-line>
          <svg-rect
              v-else-if="svg.type === 'rect'"
              :id="svg.id"
              :position="svg.data.position"
              :stroke="svg.data.stroke"
              :size="svg.data.size"
              @mousemove="mousemoveSvg"
              @click="svgClick">
          </svg-rect>
          <path v-else-if="svg.type === 'path' && svg.data.d !== 'M'" :d="svg.data.d" stroke="blue" stroke-width="1" fill="none"></path>
          <g v-else-if="svg.type === 'polyline'">
            <polyline :points="svg.data.points" stroke="blue" stroke-width="0.5" fill="none"></polyline>
            <path stroke="blue" fill="blue"  :d="arrowAttr(svg.data)"/>
          </g>
        </g>
        <g @click="inductorClick">
          <svg-inductor v-if="isShowInductor" :cycle="inductorArea"></svg-inductor>
        </g>
        <g>
          <text x="0" y="15" fill="red">I love SVG</text>
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
        <el-tooltip content="撤销" placement="top" effect="light">
          <el-button type="primary" size="mini" @click="withdraw">
            <svg-icon class="icon" icon-class="withdraw"></svg-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="放大" placement="top" effect="light">
          <el-button type="primary" size="mini" icon="el-icon-zoom-in" @click="zoomIn"></el-button>
        </el-tooltip>
        <el-tooltip content="缩小" placement="top" effect="light">
          <el-button type="primary" size="mini" icon="el-icon-zoom-out" @click="zoomOut"></el-button>
        </el-tooltip>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import svgLine from '../components/line';
import svgRect from '../components/rectangle';
import svgInductor from '../components/inductor';

import toolBar from '../components/tool-bar';
import toolBarT from '../components/tool-bar-2';

export default {
  components: {
    svgLine,
    svgRect,
    svgInductor,
    toolBar,
    toolBarT,
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
              width: 200,
              height: 160,
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
        },
        path: {
          id: `path-${Math.random()}`,
          type: 'path',
          data: {
            d: 'M',
          },
        },
        polyline: {
          id: `path-${Math.random()}`,
          type: 'polyline',
          data: {
            startPos: {},
            endPos: {},
            direction: '',
            points: '',
          },
        },
      },
      inductorArea: {
        type: 'cycle',
        r: 5,
        x: 6,
        y: 6,
        positionList: [
          {
            subSvgId: '', // 所属图形
            inductionAbilityDirection: '', // 能够连线的方向，如rect右边上的感应器，能够连接的方向就是左
            x: 10,
            y: 10,
          }
        ],
      },
      activeInductorPos: null,
      selectedShape: null,
      selectedShapeIndex: null,
      cursor: {
        'pen': `url(${window.location.origin}/static/image/pen.png) 2 14, default`,
        'line-link': 'crosshair',
      },
      penDrawing: false,
      customDrawing: false,
      customDrawingStart: false,
      customDrawingPathId: null,
      customDrawingPath: null,
      customDrawType: '',
      timer: null,
    };
  },
  watch: {
    chainArray(val) {
      this.inductorArea.positionList = this.getInductorAreaList(val);
    },
  },
  created() {
    this.inductorArea.positionList = this.getInductorAreaList(this.chainArray);
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
      if (this.customDrawingStart) {
        if (this.customDrawingPath === null) {
          this.customDrawingPath = this.chainArray.find(item => item.id === this.customDrawingPathId);
        }
        if (this.customDrawType === 'pen') {
          this.customDrawingPath.data.d += ` ${this.mousePosition.x}, ${this.mousePosition.y}`;
        }
        if (this.customDrawType === 'line-link') {
          this.customDrawingPath.data.endPos = this.mousePosition;
          this.drawPloyLine(inductorArea, this.customDrawingPath.data);
        }
      }
    },
    inductorClick() {
      // this.isShowToolBar = true;
      // this.isShowInductor = true;
      this.isActive = true;
    },
    graphSelect(graphId) {
      // this.isShowToolBar = false;
      if (graphId === 'pen' || graphId === 'line-link') {
        this.customDrawing = true;
        this.customDrawType = graphId;
      } else {
        this.customDrawing = false;
        this.isActive = false;
        this.tempSvgInfo = {
          type: graphId,
        };
      }
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
    },
    mouseDown(e) {
      if (this.customDrawing) {
        let type = '';
        this.customDrawingStart = true;
        switch (this.customDrawType) {
          case 'pen':
            type = 'path';
            break;
          case 'line-link':
            type = 'polyline';
            break;
          default:
            break;
        }
        const svg = this.getGraph({ type });
        this.customDrawingPathId = svg.id;
        if (type = 'polyline') {
          const inductorArea = this.getInductorArea(e.offsetX, e.offsetY); // 判断该点位置是否位于感应区
          if (inductorArea) {
            svg.data.startPos = inductorArea;
            svg.data.startPos.isInInductorArea = true;
          } else {
            svg.data.startPos = {
              x: e.offsetX,
              y: e.offsetY,
            };
          }
        }
        this.chainArray.push(svg);
      }
    },
    mouseUp() {
      if (this.customDrawing) {
        this.customDrawingStart = false;
        this.customDrawingPathId = null;
        this.customDrawingPath = null;
      }
    },
    mouseMove(e) {
      this.movingNode = document.getElementById(this.movingNodeId);
      this.movingNode.x = e.offsetX;
      this.movingNode.y = e.offsetY;
    },
    svgClick(e) {
      console.log(e);
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
    penDraw() {},
    drawPloyLine(inductorData, polyLineData) {
      let startPos = polyLineData.startPos;
      let endPos = polyLineData.endPos;
      const width = endPos.x - startPos.x;
      const height = endPos.y - startPos.y;
      const direction = this.judgeLineDirection(startPos, endPos);
      let startPoint = '';
      let lastPoint = '';
      if (startPos.isInInductorArea) { // 开始的点位于感应区
        ({ pos: startPos, point: startPoint } = this.getTempEndPos(startPos.inductionAbilityDirection, startPos));
        console.log(startPoint);
      }
      if (inductorData) { // 结束的点位于感应区
        ({ pos: endPos, point: lastPoint } = this.getTempEndPos(inductorData.inductionAbilityDirection, endPos));
      }
      console.log(direction);
      polyLineData.direction = direction;
      let points = `${startPos.x},${startPos.y}`;
      if (direction === 'left' || direction === 'right') {
        points += ` ${startPos.x + (width / 2)},${startPos.y} ${startPos.x + (width / 2)},${endPos.y} ${endPos.x},${endPos.y}`;
      } else {
        points += ` ${startPos.x},${startPos.y + (height / 2)} ${endPos.x},${startPos.y + (height / 2)} ${endPos.x},${endPos.y}`;
      }
      polyLineData.points = `${startPoint} ${points} ${lastPoint}`.trim();
    },
    getTempEndPos(inductionAbilityDirection, pos) {
      const tempEndPosDistance = 50;
      const obj = JSON.parse(JSON.stringify(pos));
      let point = `${pos.x},${pos.y}`;
      switch (inductionAbilityDirection) {
        case 'up':
          obj.y += tempEndPosDistance;
          break;
        case 'right':
          obj.x -= tempEndPosDistance;
          break;
        case 'down':
          obj.y -= tempEndPosDistance;
          break;
        case 'left':
          obj.x += tempEndPosDistance;
          break;
        default:
          break;
      }
      return {
        point,
        pos: obj,
      };
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
      if (params.type === 'path') {
        type = 'path';
      }
      if (params.type === 'polyline') {
        type = 'polyline';
      }
      const graph = JSON.parse(JSON.stringify(this.graphics[type]));
      graph.data.direction = direction;
      graph.id = `${type}-${Math.random()}`;
      return graph;
    },
    getInductorArea(x, y) { // 判断鼠标是否靠近感应区，返回感应区信息
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
              subSvgId: item.id,
              inductionAbilityDirection: 'down',
              x: data.position.x + (data.size.width / 2),
              y: data.position.y,
            },
            {
              subSvgId: item.id,
              inductionAbilityDirection: 'left',
              x: data.position.x + data.size.width,
              y: data.position.y + (data.size.height / 2),
            },
            {
              subSvgId: item.id,
              inductionAbilityDirection: 'up',
              x: data.position.x + (data.size.width / 2),
              y: data.position.y + data.size.height,
            },
            {
              subSvgId: item.id,
              inductionAbilityDirection: 'right',
              x: data.position.x,
              y: data.position.y + (data.size.height / 2),
            }
          );
        }
      });
      return list;
    },
    arrowAttr({ points, endPos }) { // 从points里面拿到最后两个左边，判断箭头方向
      const position = endPos;
      let direction = '';
      let startPos = {
        x: 0,
        y: 0,
      };
      const coordinates = points.split(' ');
      if (coordinates.length > 1) {
        [startPos.x, startPos.y] = coordinates[coordinates.length - 2].split(',');
        direction = this.judgeLineDirection(startPos, endPos);
      }
      let arrowAttribute = '';
      switch (direction) {
        case 'right':
          arrowAttribute = `M${position.x - 5} ${position.y - 5} l5 5 l-5 5 Z `;
          break;
        case 'left':
          arrowAttribute = `M${position.x + 5} ${position.y + 5} l-5 -5 l5 -5 Z`;
          break;
        case 'up':
          arrowAttribute = `M${position.x - 5} ${position.y + 5} l5 -5 l5 5 Z`;
          break;
        case 'down':
          arrowAttribute = `M${position.x - 5} ${position.y  - 5} l5 5 l5 -5 Z`;
          break;
        default:
          arrowAttribute = '';
      }
      return arrowAttribute;
    },
    judgeLineDirection(p1 = {x: 0, y: 0}, p2 = {x: 0, y: 0}) { // svg的起始点在左上角，y轴数值与数学象限正好相反
      const width = p2.x - p1.x;
      const height = p2.y - p1.y;
      let direction = '';
      if (width === 0 && height > 0) {
        direction = 'down';
      } else if (width === 0 && height < 0) {
        direction = 'up';
      } else if (height === 0 && width > 0) {
        direction = 'right';
      } else if (height === 0 && width < 0) {
        direction = 'left';
      } else if (width > 0 && height < 0) { // 第一象限
        if (width >= Math.abs(height)) {
          direction = 'right';
        } else {
          direction = 'up';
        }
      } else if (width < 0 && height < 0) { // 第二象限
        if (Math.abs(width) >= Math.abs(height)) {
          direction = 'left';
        } else {
          direction = 'up';
        }
      } else if (width < 0 && height > 0) { // 第三象限
        if (width >= height) {
          direction = 'left';
        } else {
          direction = 'down';
        }
      } else { // 第四象限
        if (width >= Math.abs(height)) {
          direction = 'right';
        } else {
          direction = 'down';
        }
      }
      return direction;
    },
    preventRightClick(e) {
      e.preventDefault();
      this.tempSvgInfo = {};
      this.customDrawing = false;
      this.customDrawingStart = false;
    },
    getOrigin() {
      return window.location.origin;
    },
    withdraw() {
      this.chainArray.pop();
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
    debounce(fn, delay) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(fn, delay);
    },
    throttle(fn, delay) {
      let startTime = new Date();
      return () => {
        const endTime = new Date();
        if (endTime - startTime > delay) {
          fn.apply(this);
          startTime = endTime;
        }
      };
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
  .icon {
    height: 10px !important;
    vertical-align: 0 !important;
  }
</style>