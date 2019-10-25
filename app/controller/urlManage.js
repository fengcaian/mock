'use strict';

const egg = require('egg');

module.exports = class UrlManageController extends egg.Controller {
  async swaggerUrlList(ctx) {}
  async list(ctx) {
    this.ctx.body = await ctx.service.article.getArtilceList(ctx.request.body);
  }
};
