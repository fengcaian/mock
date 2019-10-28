'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.admin.home);
  router.post('/mock/api/article/list', controller.admin.list);
  router.post('/mock/api/article/add', controller.admin.add);
  router.get('/mock/api/article/del/:id', controller.admin.del);
  router.get('/mock/api/article/:id', controller.admin.detail);
  router.get('/mock(/.+)?', controller.admin.home);
  router.post('/mock/api/url/swagger', controller.urlManage.swaggerUrlList);
  router.post('/api/url/list', controller.urlManage.list);
  router.get('', controller.urlForward.forward);
};