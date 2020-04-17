<template>
  <div class="left_top" @click="toolbarClick">
    <div class="grid">
      <div class="left border" @click="select('line-up')">
        <svg-icon class="icon" icon-class="line-up"></svg-icon>
      </div>
      <div class="right border-t border-r border-b" @click="select('line-right')">
        <svg-icon class="icon" icon-class="line-right"></svg-icon>
      </div>
      <div class="left border-l border-r border-b" @click="select('line-down')">
        <svg-icon class="icon" icon-class="line-down"></svg-icon>
      </div>
      <div class="right border-r border-b" @click="select('line-left')">
        <svg-icon class="icon" icon-class="line-left"></svg-icon>
      </div>
      <div class="left border-r border-b border-l" @click="select('pen')">
        <svg-icon class="icon" icon-class="pen"></svg-icon>
      </div>
      <div class="right border-r border-b" @click="select('rect')">
        <svg-icon class="icon" icon-class="rectangle"></svg-icon>
      </div>
      <div class="left border-r border-b border-l" @click="select('line-link')">
        <svg-icon class="icon" icon-class="line-link"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
import svgLine from './line';
import svgRect from './rectangle';
import svgPen from './pen';

export default {
  components: {
    svgLine,
    svgRect,
    svgPen,
  },
  date() {
    return {
      currentTarget: null,
    };
  },
  methods: {
    toolbarClick() {
      // this.$emit('toolbarClick');
    },
    select(type) {
      this.$emit('graphSelect', type);
    },
    draw() {
      this.$emit('penDraw');
    },
  },
}
</script>

<style scoped>
  .left_top {
    position: fixed;
    width: 140px;
    top: 100px;
    right: 10px;
    display: flex;
    align-items: center;
    z-index: 2000;
  }
  .grid {
    display: grid;
    grid-template-columns: 70px 70px;
    grid-template-rows: 70px 70px;
    cursor: pointer;
  }
  .left {
    width: 70px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    background: white;
  }
  .right {
    width: 70px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    background: white;
  }
  .border {
    border: 1px solid grey;
  }
  .border-t {
    border-top: 1px solid grey;
  }
  .border-l {
    border-left: 1px solid grey;
  }
  .border-r {
    border-right: 1px solid grey;
  }
  .border-b {
    border-bottom: 1px solid grey;
  }
  .icon {
    font-size: 50px;
    width: 75% !important;
    height: 75% !important;
  }
  .user-select-none {
    user-select: none;
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