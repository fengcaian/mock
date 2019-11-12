'use strict'

const egg = require('egg');
const Response = require('../util/Response');

module.exports = class systemManageController extends egg.Controller {
  async list(ctx) {
    const result = await ctx.service.system.getSystemList(ctx.query);
    this.ctx.body = new Response(200, null, result.dataList, result.totalRow, ctx.query.pageSize, ctx.query.currentPage);
  }
  async add(ctx) {
    try {
      const result = await ctx.service.system.add(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async delete(ctx) {
    try {
      const result = await ctx.service.system.delete(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};
