'use strict';

const egg  = require('egg');
const { dateFormat, deepCopy } = require('../util/common');

module.exports = class FlowService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async getFlowList(query) {
    const params = {};
    const list = await Promise.all([
      this.ctx.model.Flow.countDocuments(params),
      this.ctx.model.Flow.find(params)
        .sort({ createTime: -1 })
        .skip((Number(query.currentPage) - 1) * Number(query.pageSize))
        .limit(Number(query.pageSize)),
    ]);
    let result = deepCopy(list);
    result[1].forEach((item) => {
      delete item.produces;
      delete item.operationId;
      delete item.__v;
      delete item.deprecated;
    });
    return {
      totalRow: result[0],
      dataList: result[1],
    };
  }
  async save(body = {}) {
    const query = deepCopy(body);
    body.createTime = dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
    body.flowName = 'flowName';
    delete query.createTime;
    try {
      await this.ctx.model.Flow.findOneAndUpdate(query, { $set: body }, { upsert: true });
      return null;
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }

  async getFlow(query) {
    const result = await this.ctx.model.Flow.find({ _id: query._id });
    return result.length ? result[0] : {};
  }
};