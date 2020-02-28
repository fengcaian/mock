<template>
  <div class="left_top" @click="toolbarClick">
    <svg
        id="chain"
        version="1.1"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg"
        style="width: 1000px; height: 400px; margin-top: 200px">
      <path class="stroke" d="M5 5 l120 0 l0 300 l-120 0 Z"></path>
      <text x="30" y="20" fill="black">图形示例</text>
      <svg-line id="line-right" :position="{x: 30, y: 40}" :length="50" direction="right" :arrow="true"></svg-line>
      <svg-line id="line-left" :position="{x: 80, y: 70}" :length="50" direction="left" :arrow="true"></svg-line>
      <svg-line id="line-up" :position="{x: 80, y: 150}" :length="50" direction="up" :arrow="true"></svg-line>
      <g @click="select('line-down')">
        <svg-line id="line-down" :position="{x: 70, y: 70}" :length="50" direction="down" :arrow="true"></svg-line>
      </g>
    </svg>
  </div>
</template>

<script>
import svgLine from './line';

export default {
  components: {
    svgLine,
  },
  date() {
    return {};
  },
  methods: {
    toolbarClick() {
      // this.$emit('toolbarClick');
    },
    select(type) {
      this.$emit('graphSelect', type);
    },
  },
}
</script>

<style scoped>
  .left_top {
    position: fixed;
    height: 400px;
    width: 150px;
    top: 50px;
    right: 0;
    display: flex;
    align-items: center;
    z-index: 2000;
  }
  .stroke {
    stroke: rgb(79, 136, 186);
    stroke-width: 1;
    fill: #ffffff;
  }
</style>