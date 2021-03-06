'use strict';

const egg = require('egg');
const Response = require('../util/Response');

module.exports = class UrlManageController extends egg.Controller {
  async swaggerUrlList(ctx) {
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
  async list(ctx) {
    const result = await ctx.service.url.getUrlList(ctx.query);
    this.ctx.body = new Response(200, null, result.dataList, result.totalRow, ctx.query.pageSize, ctx.query.currentPage);
  }
  async delete(ctx) {
    try {
      const result = await this.ctx.service.url.delete(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async update(ctx) {
    try {
      const result = await ctx.service.url.update(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async batchDelete(ctx) {
    try {
      const result = await ctx.service.url.batchDelete(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async requestTargetSwitch(ctx) {
    try {
      const result = await ctx.service.url.requestTargetSwitch(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async urlAddByHand(ctx) {
    try {
      const result = await ctx.service.url.urlAddByHand(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};
