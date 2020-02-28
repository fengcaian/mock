<template>
  <g>
    <g class="pointer">
      <path class="line" :d="lineAttr"/>
      <path class="arrow" v-if="arrow" :d="arrowAttr"/>
    </g>
  </g>
</template>

<script>
export default {
  props: {
    length: {
      type: Number,
      default: 50,
    },
    direction: {
      type: String,
      default: 'right',
    },
    position: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0,
      })
    },
    arrow: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    lineAttr() {
      let lineAttributes = '';
      switch (this.direction) {
        case 'right':
          lineAttributes = `M${this.position.x} ${this.position.y} h${this.length}`;
          break;
        case 'left':
          lineAttributes = `M${this.position.x} ${this.position.y} h-${this.length}`;
          break;
        case 'up':
          lineAttributes = `M${this.position.x} ${this.position.y} v-${this.length}`;
          break;
        case 'down':
          lineAttributes = `M${this.position.x} ${this.position.y} v${this.length}`;
          break;
        default:
          lineAttributes = '';
      }
      return lineAttributes;
    },
    arrowAttr() {
      let arrowAttribute = '';
      switch (this.direction) {
        case 'right':
          arrowAttribute = `M${this.position.x + (this.length - 5)} ${this.position.y - 5} l5 5 l-5 5 Z `;
          break;
        case 'left':
          arrowAttribute = `M${this.position.x - (this.length - 5)} ${this.position.y + 5} l-5 -5 l5 -5 Z`;
          break;
        case 'up':
          arrowAttribute = `M${this.position.x - 5} ${this.position.y - (this.length - 5)} l5 -5 l5 5 Z`;
          break;
        case 'down':
          arrowAttribute = `M${this.position.x - 5} ${this.position.y + (this.length - 5)} l5 5 l5 -5 Z`;
          break;
        default:
          arrowAttribute = '';
      }
      return arrowAttribute;
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
  .line {
    fill: transparent;
    stroke: rgb(79, 136, 186);
    stroke-width: 0.5;
  }
  .arrow {
    fill: rgb(79, 136, 186);
    stroke: rgb(79, 136, 186);
  }
</style>