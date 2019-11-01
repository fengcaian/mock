'use strict';

const egg = require('egg');
const Mock = require('../util/Mock');
const { DATA_TYPE } = require('../util/constant');

module.exports = class UrlResponseService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async mockData(body = {}) {
    const mockData = new Mock().mock(body.responses['200'].schema.$ref);
    mockData.url = body.url;
    mockData.urlId = body._id;
    mockData.dataType = 'mock_data';
    await this.ctx.model.UrlResponse.create(mockData);
    return mockData;
  }
  async getUrlResponseList(query = {}) {
    const dataType = query.dataType.split(',');
    let queryParams = {};
    if (dataType.length) {
      queryParams.dataType = {
        $in: dataType.map(dt => DATA_TYPE.find(item => item.name === dt).code),
      };
    }
    const result = await Promise.all([
      this.ctx.model.Url.count(true),
      this.ctx.model.Url
        .find(queryParams)
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
