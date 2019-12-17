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
  async forward(ctx) {
    console.log(ctx);
    console.log(ctx.origin);
    console.log(`${ctx.origin}${ctx.url}`);
    try {
      let params, result = {};
      let ipAddress = '';
      let port = ctx.request.headers['x-forwarded-port'];
      if (ctx.request.method === 'GET') {
        params = ctx.query;
      } else if (ctx.request.method === 'POST') {
        params = ctx.request.body;
      }
      const urlObj = await ctx.service.system.getUrlSingle(
        `${ctx.request.headers['x-scheme']}://${ctx.request.headers.host}`,
        ctx.url,
        ctx.request.method.toLowerCase());
      if (urlObj.requestTarget === 'backend') {
        ipAddress = urlObj && urlObj.hostIp;
        if (!ipAddress) {
          result = {
            status: 500,
            msg: '该接口在mock系统中未匹配到Ip地址，不支持mock系统转发，请使用模拟数据或者直接请求后端。'
          };
        } else {
          [ result ] = await Promise.all([
            ctx.doCurl(`${ctx.request.headers['x-scheme']}://${ipAddress}${port ? `:${port}`: ''}${ctx.url}`, {
              data: params,
            }),
          ]);
        }
      }
      this.ctx.body = result;
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};
