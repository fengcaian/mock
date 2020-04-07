'use strict';

const egg = require('egg');
const Mock = require('../util/Mock');
const { DATA_TYPE, URL_RESPONSE_MONGODB_PROP } = require('../util/constant');
const { dateFormat } = require('../util/common');

module.exports = class UrlResponseService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async mockData(body = {}) {
    try {
      const urlObj = await this.ctx.model.Url.findOne({ _id: body._id });
      console.log(JSON.stringify(body._id));
      console.log(JSON.stringify(urlObj.responses));
      const response = new Mock().mock(urlObj.responses['200']);
      const mockData = {
        system: urlObj.host,
        url: urlObj.url,
        type: urlObj.type,
        dataType: 'mock_data',
        createTime: dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        response,
      };
      await this.ctx.model.UrlResponse.create(mockData);
      return mockData;
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }
  async getUrlResponseList(query = {}) {
    let queryParams = {
      system: query.system,
      url: query.url,
      type: query.type,
    };
    if (query.dataType) {
      const dataType = query.dataType.split(',');
      queryParams.dataType = {
        $in: dataType.map(dt => DATA_TYPE.find(item => item.name === dt).code),
      };
    }
    console.log(queryParams);
    const result = await Promise.all([
      this.ctx.model.UrlResponse.count(queryParams),
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
  async getUrlResponseByParams(query = {}) {
    let result = await this.ctx.model.UrlResponse.findOne({ url: query.url });
    if (result) {
      return result;
    }
    const urlObj = await this.ctx.model.Url.findOne({ _id: query._id });
    if (urlObj) {
      const mockData = new Mock().mock(urlObj.responses['200']);
      await this.ctx.model.UrlResponse.create(mockData);
      return mockData;
    }
    return 'url不存在！';
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
  async setPriority(body = {}) {
    let result = null;
    await this.ctx.model.UrlResponse.update({ _id: body._id }, { $set: { isPriority: body.isPriority } }, (msg) => {
      result = msg;
    });
    if (body.isPriority) { // 将其他UrlResponse的isPriority设为false
      await this.ctx.model.UrlResponse.updateMany({ _id: { $ne: body._id } }, { $set: { isPriority: false } }, (msg) => {
        result = msg;
      });
    }
    return result;
  }
  async mockDataDeleteSingle(body = {}) {
    let result = null;
    await this.ctx.model.UrlResponse.remove({ _id: body._id }, (msg) => {
      result = msg;
    });
    return result;
  }
  async mockDataDeleteBatch(body = {}) {
    const queryParams = {
      _id: {
        $in: body.idList,
      },
    };
    let result = null;
    console.log(queryParams);
    await this.ctx.model.UrlResponse.remove(queryParams, (msg) => {
      result = msg;
    });
    return result;
  }
  async getResponse(query = {}) {
    try {
      let result = await this.ctx.model.UrlResponse.find({ url: query.url, isPriority: true });
      if (result.length) {
        return [
          {
            data: result[0].response,
          },
        ];
      }
      if (query.source === 'swagger') {
        const mockData = this.mockData(query);
        result = [mockData];
      } else {
        result = '请模拟或手动添加一条返回值';
      }
      return result;
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }
  async insertResponse(body = {}) {
    const query = body;
    try {
      await this.ctx.model.UrlResponse.findOneAndUpdate(query, { $set: query });
      return null;
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }
  async editUrlResponseRemark(body = {}) {
    const query = {
      _id: body._id,
    };
    console.log(11);
    console.log(body);
    try {
      await this.ctx.model.UrlResponse.findOneAndUpdate(query, { $set: { remark: body.remark } });
      return null;
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }
};
