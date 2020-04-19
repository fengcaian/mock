'use strict'

const egg = require('egg');
const Response = require('../util/Response');

module.exports = class FlowManageController extends egg.Controller {
  async flowList(ctx) {
    try {
      const result = await ctx.service.url.getUrlAllList(ctx.request.body);
      if (Array.isArray(result)) {
        this.ctx.body = new Response(200, null, result);
      } else {
        this.ctx.body = new Response(402, result, null);
      }
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async flowSave(ctx) {
    try {
      const result = await ctx.service.flow.folwSave(ctx.request.body);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
}