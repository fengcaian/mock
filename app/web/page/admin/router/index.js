import Vue from 'vue';

import VueRouter from 'vue-router';
import Dashboard from '../view/dashboard/index.vue';
import UrlList from '../view/url-list';
import UrlDetail from '../view/url-list/url-detail';
import SystemList from '../view/system-list';

Vue.use(VueRouter);

export default function createRouter() {
  return new VueRouter({
    mode: 'history',
    base: '/mock/',
    routes: [
      {
        path: '/',
        component: Dashboard
      },
      {
        path: '*', component: () => import('../view/notfound.vue')
      },
      {
        path: '/url/list',
        component: UrlList
      },
      {
        path: '/url/detail',
        component: UrlDetail
      },
      {
        path: '/system/list',
        component: SystemList
      },
    ]
  });
}