import Vue from 'vue';

import VueRouter from 'vue-router';
import Dashboard from '../view/dashboard/index.vue';
import UrlList from '../view/mock-swagger/url-list';
import UrlDetail from '../view/mock-swagger/url-list/url-detail';
import AddUrlByHand from '../view/mock-swagger/url-list/add-url-by-hand';
import SystemList from '../view/mock-swagger/system-list';
import SynthesizeSet from '../view/mock-swagger/system-list';
import CheckList from '../view/model-database-check/check-list';
import Check from '../view/model-database-check/check';

Vue.use(VueRouter);

export default function createRouter() {
  const router =  new VueRouter({
    mode: 'history',
    base: '/',
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
        path: '/mock/url/list',
        meta: { title: 'URL查询' },
        component: UrlList
      },
      {
        path: '/mock/url/detail',
        meta: { title: 'URL详情' },
        component: UrlDetail
      },
      {
        path: '/mock/url/add-url-by-hand',
        meta: { title: '手动新增url' },
        component: AddUrlByHand,
      },
      {
        path: '/mock/system/list',
        meta: { title: '系统查询' },
        component: SystemList
      },
      {
        path: '/mock/synthesize/set',
        meta: { title: '综合设置' },
        component: SynthesizeSet
      },
      {
        path: '/model/database/check/list',
        meta: { title: '核查列表' },
        component: CheckList,
      },
      {
        path: '/model/database/check',
        meta: { title: '核查' },
        component: Check,
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
