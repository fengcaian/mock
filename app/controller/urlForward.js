'use strict';

const egg = require('egg');

module.exports = class UrlController extends egg.Controller {
  async forwardGet(ctx) {
    try {
      console.log(1111);
      const url = ctx.url.indexOf('?') === -1 ? ctx.url : ctx.url.split('?')[0];
      const [ result ] = await Promise.all([
        ctx.doCurl(url, {
          data: ctx.query,
        }),
      ]);
      this.ctx.body = result;
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async forwardPost(ctx) {
    try {
      const [ result ] = await Promise.all([
        ctx.doCurl(ctx.url, {
          data: ctx.request.body,
        }),
      ]);
      this.ctx.body = result;
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};
