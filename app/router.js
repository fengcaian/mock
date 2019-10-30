'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.admin.home);
  router.post('/mock/api/article/list', controller.admin.list);
  router.post('/mock/api/article/add', controller.admin.add);
  router.get('/mock/api/article/del/:id', controller.admin.del);
  router.get('/mock/api/article/:id', controller.admin.detail);
  router.post('/mock/api/url/swagger', controller.urlManage.swaggerUrlList);
  router.post('/mock/api/url/delete', controller.urlManage.delete);
  router.post('/mock/api/url/batch/delete', controller.urlManage.batchDelete);
  router.get('/mock/api/url/list', controller.urlManage.list);
  router.post('/mock/api/url/mock/data', controller.urlManage.mockData);
  router.get('/mock(/.+)?', controller.admin.home);
  router.get('', controller.urlForward.forward);
};