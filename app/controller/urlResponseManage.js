'use strict';

const egg = require('egg');
const Response = require('../util/Response');
const { dateFormat } = require('../util/common');

module.exports = class UrlResponseManageController extends egg.Controller {
  async mockData(ctx) {
    try {
      const result = await ctx.service.urlResponse.mockData(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async getUrlResponseList(ctx) {
    try {
      const result = await ctx.service.urlResponse.getUrlResponseList(ctx.query);
      this.ctx.body = new Response(200, null, result.dataList, result.totalRow, ctx.query.pageSize, ctx.query.currentPage);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async getUrlResponseByParams(ctx) {
    try {
      const result = await ctx.service.urlResponse.getUrlResponseByParams(ctx.query);
      this.ctx.body = new Response(200, null, result.dataList, result.totalRow, ctx.query.pageSize, ctx.query.currentPage);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async editUrlResponse(ctx) {
    try {
      const result = await ctx.service.urlResponse.editUrlResponse(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async setPriority(ctx) {
    try {
      const result  = await ctx.service.urlResponse.setPriority(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async mockDataDeleteSingle(ctx) {
    try {
      const result  = await ctx.service.urlResponse.mockDataDeleteSingle(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async mockDataDeleteBatch(ctx) {
    try {
      const result  = await ctx.service.urlResponse.mockDataDeleteBatch(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async add(ctx) {
    try {
      console.log(ctx.request.body);
      console.log(typeof ctx.request.body);
      const createTime = dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
      console.log(createTime);
      const result  = await ctx.model.UrlResponse.create(Object.assign({ createTime }, ctx.request.body));
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async editUrlResponseRemark(ctx) {
    try {
      const result  = await ctx.service.urlResponse.editUrlResponseRemark(ctx.request.body);
      this.ctx.body = new Response(200, null, result);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};
