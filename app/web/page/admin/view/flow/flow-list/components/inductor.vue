<template>
  <g class="pointer">
    <circle :cx="cycle.x" :cy="cycle.y" :r="cycle.r" class="cycle" />
    <line :x1="`${cycle.x - cycle.r}`" :y1="cycle.y" :x2="`${cycle.x + cycle.r}`" :y2="cycle.y" class="line"/>
    <line :x1="cycle.x" :y1="`${cycle.y - cycle.r}`" :x2="cycle.x" :y2="`${cycle.y + cycle.r}`" class="line"/>
  </g>
</template>

<script>
export default {
  props: {
    cycle: {
      type: Object,
      default: () => ({
        x: 10,
        y: 10,
        r: 9,
      }),
    },
  },
  data() {
    return {};
  },
}
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
  .cycle {
    fill: #ffffff;
    stroke: rgb(79, 136, 186);
    stroke-width: 1;
  }
  .line {
    stroke: rgb(79, 136, 186);
    stroke-width: 1;
  }
</style>