module.exports = app => {
  const { router, controller } = app;
  const jsonp = app.jsonp();
  router.get('/', controller.home.client);
  router.get('/server', app.controller.home.server);
  router.post('/mock/api/url/swagger', controller.urlManage.swaggerUrlList);
  router.post('/mock/api/url/delete', controller.urlManage.delete);
  router.post('/mock/api/url/update', controller.urlManage.update);
  router.post('/mock/api/url/batch/delete', controller.urlManage.batchDelete);
  router.post('/mock/api/url/request/target/switch', controller.urlManage.requestTargetSwitch);
  router.get('/mock/api/url/list', controller.urlManage.list);
  router.post('/mock/api/url/add/by/hand', controller.urlManage.urlAddByHand);
  router.post('/mock/api/url/mock/data', controller.urlResponseManage.mockData);
  router.get('/mock/api/url/response/list', controller.urlResponseManage.getUrlResponseList);
  router.get('/mock/api/url/response/by/params', controller.urlResponseManage.getUrlResponseByParams);
  router.post('/mock/api/url/response/edit', controller.urlResponseManage.editUrlResponse);
  router.post('/mock/api/url/response/remark/edit', controller.urlResponseManage.editUrlResponseRemark);
  router.post('/mock/api/url/response/set/priority', controller.urlResponseManage.setPriority);
  router.post('/mock/api/url/mock/data/delete/single', controller.urlResponseManage.mockDataDeleteSingle);
  router.post('/mock/api/url/mock/data/delete/batch', controller.urlResponseManage.mockDataDeleteBatch);
  router.post('/mock/api/url/response/add', controller.urlResponseManage.add);
  router.get('/mock/api/system/list', controller.systemManage.list);
  router.post('/mock/api/system/add', controller.systemManage.add);
  router.post('/mock/api/system/update', controller.systemManage.update);
  router.post('/mock/api/system/add/ipaddress', controller.systemManage.addIpAddress);
  router.post('/mock/api/system/swagger/api/reload', controller.systemManage.reloadSwaggerAPI);
  router.post('/mock/api/system/delete', controller.systemManage.delete);
  router.post('/mock/api/system/enable', controller.systemManage.enableSwitch);
  router.post('/model/file/analyse', controller.fileManage.analyse);
  router.get('/mock/api/synthesize/config/list', controller.synthesizeConfig.getList);
  router.post('/mock/api/synthesize/config/add', controller.synthesizeConfig.save);
  router.post('/mock/api/synthesize/config/modify', controller.synthesizeConfig.modify);
  router.get('/mock/api/flow/g6/list', controller.flowManage.getList);
  router.post('/mock/api/flow/g6/save', controller.flowManage.save);
  router.get('/mock/api/flow/g6/get', controller.flowManage.getFlow);
  router.get('/mock(/.+)?', controller.home.frontRouterForward); // 前端路由刷新进入该控制器，要求所有前端路由必须以mock开头，不能与后端api重名
  router.get(/([a-z]+)/, jsonp, controller.urlForward.forward);
  router.options(/([a-z]+)/, controller.urlForward.forward);
  router.post(/([a-z]+)/, controller.urlForward.forward);
};