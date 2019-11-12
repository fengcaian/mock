<template>
  <div class="tabs">
    <div class="tab-scroll" :style="tabScrollStyle">
      <div
          class="tab"
          v-for="tab in tabs" :key="tab.name"
          :class="{ 'is-actived': tab.label === active_tab }"
          :style="customerActiveTabStyle(tab)"
          @click="activeTab(tab)">
        {{tab.label}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      default: [],
      type: Array,
    },
    tabClass: {
      type: Object,
      default: () => {},
    },
    activeTabStyle: {
      type: Object,
      default: () => {},
    },
    tabScrollStyle: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      active_tab: '',
      customer_active_tab_style: '',
    };
  },
  created() {
    if (this.tabs.length) {
      this.active_tab = this.tabs[0].label;
    }
    console.log(this.activeTabStyle);
    console.log(this.tabScrollStyle);
  },
  methods: {
    customerActiveTabStyle(t) {
      if (t.label === this.active_tab) {
        return this.activeTabStyle;
      }
    },
    activeTab(t) {
      this.active_tab = t.label;
      this.$emit('tabClick', t);
    },
  },
};
</script>

<style scoped>
  .tabs {
    border: 1px solid #DCDFE6;
    border-radius: 4px;
  }
  .tab-scroll {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    font-size: 14px;
  }
  .tab {
    height: 38px;
    line-height: 38px;
    padding: 0 20px;
    cursor: pointer;
  }
  .is-actived {
    background: #FFFFFF;
  }
</style>