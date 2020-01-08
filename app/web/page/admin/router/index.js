import Vue from 'vue';

import VueRouter from 'vue-router';
import Dashboard from '../view/dashboard/index.vue';
import UrlList from '../view/url-list';
import UrlDetail from '../view/url-list/url-detail';
import AddUrlByHand from '../view/url-list/add-url-by-hand';
import SystemList from '../view/system-list';

Vue.use(VueRouter);

export default function createRouter() {
  const router =  new VueRouter({
    mode: 'history',
    base: '/mock/',
    routes: [
      {
        path: '/',
        meta: { title: '统计面板' },
        component: Dashboard
      },
      {
        path: '*', component: () => import('../view/notfound.vue'),
        meta: { title: '404 not found' },
      },
      {
        path: '/url/list',
        meta: { title: 'URL查询' },
        component: UrlList
      },
      {
        path: '/url/detail',
        meta: { title: 'URL详情' },
        component: UrlDetail
      },
      {
        path: '/url/add-url-by-hand',
        meta: { title: '手动新增url' },
        component: AddUrlByHand,
      },
      {
        path: '/system/list',
        meta: { title: '系统查询' },
        component: SystemList
      },
    ]
  });
  router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title;
    }
    next();
  });
  return router;
}
