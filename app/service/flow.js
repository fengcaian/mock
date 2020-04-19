'use strict';

const egg  = require('egg');
const { dateFormat } = require('../util/common');

module.exports = class FlowService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async flowSave(body = {}) {
    const query = JSON.parse(JSON.stringify(body));
    delete query.createTime;
    try {
      await this.ctx.model.Flow.findOneAndUpdate(query, { $set: body }, { upsert: true });
      return null;
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }
};