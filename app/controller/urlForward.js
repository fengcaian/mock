'use strict';

const egg = require('egg');

module.exports = class UrlController extends egg.Controller {
  async forwardGet(ctx) {
    try {
      console.log(ctx);
      const url = ctx.url.indexOf('?') === -1 ? ctx.url : ctx.url.split('?')[0];
      const [ result ] = await Promise.all([
        ctx.doCurl(`${ctx.origin}${ctx.url}`, {
          data: ctx.query,
        }),
      ]);
      this.ctx.body = result;
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  async forwardPost(ctx) {
    console.log(ctx);
    try {
      const [ result ] = await Promise.all([
        ctx.doCurl(`${ctx.origin}${ctx.url}`, {
          data: ctx.request.body,
        }),
      ]);
      this.ctx.body = result;
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};
