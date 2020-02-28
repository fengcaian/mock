<template>
  <AdminLayout>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </AdminLayout>
</template>

<script type="jsx">
import Vue from 'vue';
import '@/app/web/framework/network';
import testMixin from '@/app/web/framework/utils/mixin/testMixin';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'highlight.js/styles/default.css';
import hljs from './directive/highlight';
import AdminLayout from 'component/layout/admin/index.vue';

Vue.use(ElementUI);
Vue.directive('high-light', hljs);
// Vue.mixin(testMixin);

export default {
  data() {
    return {
      appData: 444444,
    };
  },
  ffffffff: 5555555555,
  routerrr: [{
    path: 'test',
    name: 'testtttt',
  }],
  components: {
    AdminLayout,
  },
  computed: {},
  created() {
    console.log(333);
  },
  mounted() {},
};
</script>