'use strict';

const egg = require('egg');
const Response = require('../util/Response');

module.exports = class FlowManageController extends egg.Controller {
  async getList(ctx) {
    try {
      const result = await ctx.service.flow.getFlowList(ctx.query);
      this.ctx.body = new Response(200, null, result.dataList, result.totalRow, ctx.query.pageSize, ctx.query.currentPage);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async save(ctx) {
    try {
      const result = await ctx.service.flow.save(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async getFlow(ctx) {
    try{
      const result = await ctx.service.flow.getFlow(ctx.query);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};