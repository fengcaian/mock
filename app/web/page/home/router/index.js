import Vue from 'vue';

import VueRouter from 'vue-router';
import Dashboard from '../view/dashboard/index.vue';
import UrlList from '../view/mock-swagger/url-list';
import UrlDetail from '../view/mock-swagger/url-list/url-detail';
import AddUrlByHand from '../view/mock-swagger/url-list/add-url-by-hand';
import SystemList from '../view/mock-swagger/system-list';
import SynthesizeConfig from '../view/mock-swagger/synthesize-config';
import CheckList from '../view/model-database-check/check-list';
import Check from '../view/model-database-check/check';
import FlowList from '../view/flow/flow-list';
import FlowView from '../view/flow/flow-list/flow-view';
import MxGraph from '../view/flow/mx-graph';
import MxGraphTest from '../view/flow/mx-graph-test';
import G6 from '../view/flow/g6';
import G6Test from '../view/flow/g6-test';
import G6List from '../view/flow/g6-list';
import FlowEdit from '../view/flow/g6-list/flow-edit';

Vue.use(VueRouter);

export default function createRouter() { // 所有前端路由必须以mock开头，不能与后端api重名,否则浏览器刷新功能失效
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
        path: '/mock/synthesize/config',
        meta: { title: '综合配置' },
        component: SynthesizeConfig
      },
      {
        path: '/mock/model/database/check/list',
        meta: { title: '核查列表' },
        component: CheckList,
      },
      {
        path: '/mock/model/database/check',
        meta: { title: '核查' },
        component: Check,
      },
      {
        path: '/mock/flow/list',
        meta: { title: '流程列表' },
        component: FlowList,
      },
      {
        path: '/mock/flow/view',
        meta: { title: '流程' },
        component: FlowView,
      },
      {
        path: '/mock/flow/mx-graph',
        meta: { title: 'mxGraph' },
        component: MxGraph,
      },
      {
        path: '/mock/flow/g6',
        meta: { title: 'g6' },
        component: G6,
      },
      {
        path: '/mock/flow/g6-test',
        meta: { title: 'g6Test' },
        component: G6Test,
      },
      {
        path: '/mock/flow/g6-list',
        meta: { title: 'g6-list' },
        component: G6List,
      },
      {
        path: '/mock/flow/flow-edit',
        meta: { title: 'flow-edit' },
        component: FlowEdit,
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
