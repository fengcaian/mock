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
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import AdminLayout from 'component/layout/admin/index.vue';

Vue.use(ElementUI);

export default {
  components: {
    AdminLayout,
  },
  computed: {},
  mounted() {},
};
</script>