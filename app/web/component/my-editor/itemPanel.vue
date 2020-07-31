<template>
  <div class="item-panel">
    <item></item>
  </div>
</template>

<script>
import item from './item';
import eventBus from './../../framework/utils/common/eventBus';

export default {
  components: {
    item,
  },
  data() {
    return {};
  },
  computed: {
    page() {
      return this.$store.state.g6Editor;
    },
    command() {
      return this.$store.state.g6Editor.command;
    }
  },
  created() {
    this.bindEvent();
  },
  destroyed() {
    eventBus.$off('afterAddPage');
  },
  methods: {
    bindEvent() {
      const self = this;
      eventBus.$on('afterAddPage', page => {
        self.page = page;
      });
    },
  },
};
</script>

<style scoped>
  .item-panel {
    height: 100%;
    position: absolute;
    left: 0;
    z-index: 2;
    background: #f7f9fb;
    width: 200px;
    padding-top: 8px;
    font-size: 12px;
    border-right: 1px solid #e6e9ed;
  }
  .item-panel ul {
    padding-left: 16px;
  }
  .item-panel li {
    color: rgba(0, 0, 0, 0.65);
    border-radius: 4px;
    width: 160px;
    height: 28px;
    line-height: 26px;
    padding-left: 8px;
    border: 1px solid rgba(0, 0, 0, 0);
    list-style-type: none;
  }
  .item-panel li:hover {
    background: white;
    border: 1px solid #ced4d9;
    cursor: move;
  }

  .item-panel .pannel-type-icon {
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }
</style>