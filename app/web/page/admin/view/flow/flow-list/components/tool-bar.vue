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
      <g @click="select('line-up')">
        <path class="wrapper" d="M50 85 l20 0 l0 -50 l-20 0 Z" stroke="white" stroke-width="1" fill="white"></path>
        <svg-line :position="{x: 60, y: 80}" :length="40" direction="up" :arrow="true"></svg-line>
      </g>
      <g @click="select('line-right')">
        <path class="wrapper" d="M35 110 l50 0 l0 -20 l-50 0 Z" stroke="white" stroke-width="1" fill="white"></path>
        <svg-line :position="{x: 40, y: 100}" :length="40" direction="right" :arrow="true"></svg-line>
      </g>
      <g @click="select('line-down')">
        <path class="wrapper" d="M50 115 l20 0 l0 50 l-20 0 Z" stroke="white" stroke-width="1" fill="white"></path>
        <svg-line :position="{x: 60, y: 120}" :length="40" direction="down" :arrow="true"></svg-line>
      </g>
      <g @click="select('line-left')">
        <path class="wrapper" d="M85 170 l0 20 l-50 0 l0 -20 Z" stroke="white" stroke-width="1" fill="white"></path>
        <svg-line :position="{x: 80, y: 180}" :length="40" direction="left" :arrow="true"></svg-line>
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
  .wrapper {
    cursor: pointer;
    transition: transform .3s ease-in-out, box-shadow .3s cubic-bezier(.47, 0, .745, .715), border .3s linear .1s;
  }
  .wrapper:hover {
    box-shadow: 0 10px 50px rgba(51, 51, 51, .25);
    -webkit-transform: translateY(-10px);
    -moz-transform: translateY(-10px);
    transform: translateY(-10px)
  }
</style>