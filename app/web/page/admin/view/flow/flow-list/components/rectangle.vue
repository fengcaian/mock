<template>
  <g class="pointer" @click="clickRectangle">
    <rect :id="id" class="rect" :stroke="stroke" :x="position.x" :y="position.y" :width="size.width" :height="size.height"></rect>
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
    return {};
  },
  methods: {
    clickRectangle() {
      console.log(1234);
    }
  },
}
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
  .rect {
    fill: white;
    stroke-width: 1;
    rx: 10;
    ry: 10;
  }
</style>