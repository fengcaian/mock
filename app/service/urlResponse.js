'use strict';

const egg = require('egg');
const Mock = require('../util/Mock');

module.exports = class UrlResponseService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async mockData(body = {}) {
    const mockData = new Mock().mock(body.responses['200'].schema.$ref);
    mockData.url = body.url;
    await this.ctx.model.UrlResponse.create(mockData);
    return mockData;
  }
  async getUrlResponseList(query = {}) {
    const result = await Promise.all([
      this.ctx.model.Url.count(true),
      this.ctx.model.Url.find()
        .sort({ id: -1 })
        .skip((Number(query.currentPage) - 1) * Number(query.pageSize))
        .limit(Number(query.pageSize)),
    ]);
    return {
      totalRow: result[0],
      dataList: result[1],
    };
  }
};
