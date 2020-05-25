'use strict';

const egg = require('egg');
const Response = require('../util/Response');

module.exports = class SynthesizeConfigController extends egg.Controller {
  async getList(ctx) {
    console.log(this.app.proxySystemList);
    console.log(this.ctx.proxySystemList);
    const result = await ctx.service.synthesizeConfig.getList(ctx.query);
    this.ctx.body = new Response(200, null, result);
  }
  async save(ctx) {
    const result = await ctx.service.synthesizeConfig.add(ctx.request.body);
    this.ctx.body = new Response(200, null, result);
  }
  async modify(ctx) {
    const result = await ctx.service.synthesizeConfig.modify(ctx.request.body);
    this.ctx.body = new Response(200, null, result);
  }
};