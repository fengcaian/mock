'use strict';

const egg = require('egg');
const Mock = require('../util/Mock');
const { DATA_TYPE, URL_RESPONSE_MONGODB_PROP } = require('../util/constant');

module.exports = class UrlResponseService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async mockData(body = {}) {
    try {
      const urlObj = await this.ctx.model.Url.findOne({ _id: body._id });
      const mockData = new Mock().mock(urlObj.responses['200'].schema.$ref);
      mockData.url = body.url;
      mockData.urlId = body._id;
      mockData.dataType = 'mock_data';
      await this.ctx.model.UrlResponse.create(mockData);
      return mockData;
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }
  async getUrlResponseList(query = {}) {
    let queryParams = {
      urlId: query.urlId,
    };
    if (query.dataType) {
      const dataType = query.dataType.split(',');
      queryParams.dataType = {
        $in: dataType.map(dt => DATA_TYPE.find(item => item.name === dt).code),
      };
    }
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
  async editUrlResponse(body = {}) {
    const post = {};
    Object.keys(body).forEach(key => {
      if (URL_RESPONSE_MONGODB_PROP.indexOf(key) === -1) {
        post[key] = body[key];
      }
    });
    try {
      await this.ctx.model.UrlResponse.update({ _id: body._id }, post);
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }
};
