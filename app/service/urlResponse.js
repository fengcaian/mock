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
    console.log(query);
    let queryParams = {
      urlId: query.urlId,
    };
    if (query.dataType) {
      const dataType = query.dataType.split(',');
      queryParams.dataType = {
        $in: dataType.map(dt => DATA_TYPE.find(item => item.name === dt).code),
      };
    }
    console.log(queryParams);
    const result = await Promise.all([
      this.ctx.model.UrlResponse.count(true),
      this.ctx.model.UrlResponse
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
