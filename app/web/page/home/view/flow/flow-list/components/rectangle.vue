<template>
  <g id="rect" class="pointer" @click="clickRectangle" @dblclick="dblclickRect" draggable="true">
    <rect :id="id" rx="10" stroke-width="1" fill="#fff" :stroke="stroke" :x="position.x" :y="position.y" :width="size.width" :height="size.height"></rect>
    <!--<g @click="foreignObjectClick" @mousemove="foreignObjectMousemove">-->
      <!--<foreignObject :x="position.x" :y="position.y" :width="size.width" :height="size.height">-->
        <!--<body xmlns="http://www.w3.org/1999/xhtml">-->
        <!--<div class="panel">-->
          <!--<el-input v-if="isInEdit" ref="rect-input" type="textarea" v-model="value" :style="{width: `${size.width}px`, height: `${size.height}px`}" class="rect-input"></el-input>-->
          <!--<span v-else></span>-->
        <!--</div>-->
        <!--</body>-->
      <!--</foreignObject>-->
    <!--</g>-->
  </g>
</template>

<script>
export default {
  props: {
    position: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0,
      })
    },
    size: {
      type: Object,
      default: () => ({
        width: 100,
        height: 60,
      })
    },
    stroke: {
      type: String,
      default: 'rgb(79, 136, 186)',
    },
    id: {
      type: String,
      default: `rect-${Math.random()}`,
    },
  },
  data() {
    return {
      value: '',
      isInEdit: false,
    };
  },
  methods: {
    clickRectangle() {
      console.log(1234);
    },
    foreignObjectClick(e) {
      this.$emit('click', e)
    },
    foreignObjectMousemove(e) {
      this.$emit('mousemove', e)
    },
    dblclickRect() {
      this.isInEdit = true;
      this.$nextTick(() => {
        this.$refs['rect-input'].focus();
      })
    },
  },
}
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
  .rect {
    fill: white;
    rx: 10;
    ry: 10;
  }
  .width-100 {
    width: 100px;
  }
  .rect-input {
    padding: 10px;
  }
  .panel {
    width: 100%;
    height: 100%;
  }
</style>
<style>
  #rect .el-input__inner {
    text-align: center;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 0px;
    /*outline: medium;*/
  }
  #rect .el-textarea__inner {
    text-align: center;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 0px;
  }
</style>