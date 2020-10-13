<template>
  <ul>
    <li
      v-for="(item, index) in list"
      :key="index"
      :data-shape="item.shape"
      :data-type="item.type"
      :data-size="item.size"
      draggable
      @dragstart="handleDragStart"
      @dragend="handleDragEnd($event, item)">
      <span class="pannel-type-icon" :style="{background:'url('+item.image+')'}"></span>
      {{item.name}}
    </li>
  </ul>
</template>

<script>
import eventBus from './../../framework/utils/common/eventBus';
import okSvg from './../../asset/images/ok.svg';

export default {
  data() {
    return {
      offsetX: 0,
      offsetY: 0,
      list: [
        {
          name: '节点名称',
          label: '节点名称',
          innerCycleLabel: '1',
          size: '120*100',
          type: 'node',
          shape: 'customNode',
          x: 0,
          y: 0,
          color: '#1890ff',
          image: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
          stateImage: okSvg,
          inPoints: [[0, 0.5], [0.5, 0], [1, 0.5], [0.5, 1]],
          outPoints: [[1, 0.5], [0.5, 1], [0, 0.5], [0.5, 0]],
          isDoingEnd: true
        }
      ],
    };
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
  beforeDestroy() {
    eventBus.$off('afterAddPage');
  },
  methods: {
    handleDragStart(e) {
      this.offsetX = e.offsetX;
      this.offsetY = e.offsetY;
    },
    handleDragEnd(e, item) {
      let data = Object.assign({}, item);
      data.offsetX = this.offsetX;
      data.offsetY = this.offsetY;
      if (this.page) {
        const graph = this.page.graph;
        const xy = graph.getPointByClient(e.x, e.y);
        data.x = xy.x;
        data.y = xy.y;
        data.size = item.size.split('*');
        this.command.executeCommand('add', [data]);
      }
    },
    bindEvent() {
      const self = this;
      eventBus.$on('afterAddPage', page => {
        console.log('i am item,afterAddPage');
        self.page = page;
        self.command = page.command;
      });
    }
  },
};
</script>

<style scoped>
  .item-panel ul {
    padding-left: 16px;
  }
  .item-panel li {
    color: rgba(0, 0, 0, 0.65);
    border-radius: 4px;
    width: 120px;
    height: 100px;
    line-height: 100px;
    padding-left: 8px;
    border: 2px solid lightskyblue;
    list-style-type: none;
  }
  .item-panel li:hover {
    background: white;
    border: 2px solid #ced4d9;
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