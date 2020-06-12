'use strict';

const egg = require('egg');
module.exports = class SynthesizeConfig extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async getList(query = {}) {
    const queryParams = {};
    Object.keys(query).forEach((key) => {
      if (query[key] !== '') {
        queryParams[key] = query[key];
      }
    });
    console.log(12321);
    console.log(queryParams);
    const result = await Promise.resolve(this.ctx.model.SynthesizeConfig.find(queryParams).sort({ id: -1 }));
    if (result && Array.isArray(result)) {
      return result;
    }
    return null;
  }
  async add(body) {
    try {
      if (body) {
        body.isProxy = true;
      }
      return await this.ctx.model.SynthesizeConfig.create(body);
    } catch (err) {
      this.ctx.logger.error(err);
    }
  }
  async modify(body) {
    try {
      return await this.ctx.model.SynthesizeConfig.update({ _id: body._id }, body);
    } catch (err) {
      this.ctx.logger.error(err);
    }
  }
};