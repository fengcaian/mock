<template>
  <div class="drawer_wrapper" :class="{'in': !isDrawerShrink}" :style="{width: isDrawerShrink ? '20px' : drawerWidth}">
    <div class="drawer_handler" @click="isDrawerShrink = !isDrawerShrink">{{handler}}</div>
    <div class="drawer_container" :style="{width: `${size}px`}" v-if="!isDrawerShrink">
      <header class="drawer_title" v-if="withTitle">{{title}}</header>
      <article class="drawer_body">
        <slot></slot>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: '标题',
      type: String,
    },
    withTitle: {
      default: true,
      type: Boolean,
    },
    drawerHandleOpen: {
      default: '点击打开',
      type: String,
    },
    drawerHandleClose: {
      default: '点击关闭',
      type: String,
    },
    size: {
      default: 200,
      type: Number,
    }
  },
  data() {
    return {
      isDrawerShrink: true,
    };
  },
  computed: {
    handler() {
      return this.isDrawerShrink ? this.drawerHandleOpen : this.drawerHandleClose;
    },
    drawerWidth() {
      if (typeof this.size === 'number') {
        return `${this.size + 20}px`;
      }
      return `${this.size}px`;
    },
  },
}
</script>

<style scoped>
  .drawer_wrapper {
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    z-index: 2000;
  }
  .drawer_handler {
    display: flex;
    flex-direction: column;
    writing-mode: vertical-rl;
    margin-bottom: 50px;
    cursor: pointer;
    color: #22d0e8;
    z-index: 2001;
  }
  .drawer_container {
    height: 100vh;
    right: 0;
    position: relative;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12);
    overflow: hidden;
    z-index: 2001;
  }
  .drawer_title {
    z-index: 2002;
    color: #72767b;
    padding: 15px;
    font-size: 18px;
  }
  .drawer_body {
    z-index: 2002;
    padding: 10px 15px;
  }
  .in {
    animation: drawer_in 0.5s;
    animation-fill-mode:forwards;
  }
  .out {
    animation: drawer_out 0.5s;
    animation-fill-mode:forwards;
  }
  @keyframes drawer_in {
    0% {transform: translate(100%);}
    100% {transform: translate(0);}
  }
  @keyframes drawer_out {
    0% {transform: translate(0);}
    100% {transform: translate(100%);}
  }
</style>