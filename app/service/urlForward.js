'use strict';

const egg = require('egg');
const { dateFormat } = require('../util/common');
module.exports = class UrlForward extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async goToBackend(body) {
    const result = await Promise.all([
      this.ctx.doCurl(body.url, body.params),
    ]);
    return result || [];
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
    await this.ctx.service.urlResponse.insertResponse(urlResponse);
  }
};