<template>
  <layout>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </layout>
</template>

<script>
import Vue from 'vue';
import '@/app/web/framework/network';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'highlight.js/styles/default.css';
import hljs from './directive/highlight';
import layout from 'component/layout/admin/index.vue';

Vue.use(ElementUI);
Vue.directive('high-light', hljs);

export default {
  components: {
    layout,
  },
  computed: {},
  methods: {},
  mounted() {

  }
}
</script>

<style scoped>

</style>