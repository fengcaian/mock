<template>
  <transition name="fade" mode="out-in">
    <div class='main admin'>
      <LayoutHeader></LayoutHeader>
      <LayoutContent>
        <router-view></router-view>
      </LayoutContent>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'highlight.js/styles/default.css';
import '@/app/web/framework/network';
import hljs from './directive/highlight';
import layout from 'component/layout/admin/index.vue';
import LayoutHeader from '../../component/layout/admin/header/header';
import LayoutContent from '../../component/layout/admin/content/content';

Vue.use(ElementUI);
Vue.directive('high-light', hljs);
export default {
  components: {
    layout,
    LayoutHeader,
    LayoutContent
  },
  computed: {},
  methods: {},
  mounted() {

  }
}
</script>

<style scoped>

</style>
<style>
@import '../../../web/asset/css/global.css';
@import '../../component/layout/admin/index.css';
</style>