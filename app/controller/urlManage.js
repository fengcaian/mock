'use strict';

const egg = require('egg');

module.exports = class UrlManageController extends egg.Controller {
  async list(ctx) {
    this.ctx.body = await ctx.service.article.getArtilceList(ctx.request.body);
  }
  async swaggerUrlList(ctx) {
    try {
      this.ctx.body = await ctx.service.url.getUrlAllList(ctx.request.body);
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};
