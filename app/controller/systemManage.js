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
  async update(ctx) {
    try {
      const result = await ctx.service.system.update(ctx.request.body);
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
  async enableSwitch(ctx) {
    try {
      const result = await ctx.service.system.enableSwitch(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async reloadSwaggerAPI(ctx) {
    try {
      const result = await ctx.service.system.reloadSwaggerAPI(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async addIpAddress(ctx) {
    try {
      const result = await ctx.service.system.addIpAddress(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};
