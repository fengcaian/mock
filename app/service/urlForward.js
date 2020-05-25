'use strict';

const egg = require('egg');
const { dateFormat } = require('../util/common');
module.exports = class UrlForward extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  goToMock() {}
  async goToBackend(body) {
    const result = await Promise.resolve([
      this.ctx.doCurl(body.url, body.params),
    ]);
    return result || {};
  }
  async backUpBackendData(body) {
    const urlResponse = {
      system: body.host,
      url: body.url,
      type: body.type,
      dataType: 'backend_data',
      createTime: dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      response: body.data,
    };
    await this.ctx.service.UrlResponse.insertResponse(urlResponse);
  }
};