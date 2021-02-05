<template>
  <div>
    <h3>object.freeze</h3>
    <div class="row" v-for="item in list">{{item.name}}</div>
    <h :level="2">h2</h>
  </div>
</template>

<script>
var list = [];
for (var i = 0; i < 1; i += 1) {
  var o = {
    name: 'test-data-' + i,
  };
  Object.freeze(o);
  list.push(o);
}
import h from './test';
export default {
  components: {
    h,
  },
  data() {
    return {
      list: list,
    };
  },
}
</script>

<style scoped>
  .row {
    width: 500px;
    height: 20px;
    line-height: 20px;
    text-align: center;
  }
</style>