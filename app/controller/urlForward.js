'use strict';

const egg = require('egg');
const Response = require('../util/Response');
const { dateFormat } = require('../util/common');

module.exports = class UrlController extends egg.Controller {
  async forward(ctx) {
    try {
      const url = ctx.url.split('?')[0];
      let params, result = {};
      let ipAddress = '';
      let port = ctx.request.headers['x-forwarded-port'];
      if (['GET', 'OPTIONS'].indexOf(ctx.request.method) !== -1) {
        params = {};
      } else if (ctx.request.method === 'POST') {
        params = ctx.request.headers['x-content-type'] === 'application/json;charset=UTF-8' ? JSON.stringify(ctx.request.body) : ctx.request.body;
      }
      const urlObj = await ctx.service.url.getUrlSingle(
        `${ctx.request.headers['x-scheme']}://${ctx.request.headers.host}`,
        url,
        ctx.request.method.toLowerCase() === 'options' ? 'post': ctx.request.method.toLowerCase(),
      );
      if (urlObj.requestTarget === 'backend') {
        ipAddress = urlObj && urlObj.hostIp;
        if (!ipAddress) {
          result = [
            {
              data: {
                status: 500,
                msg: '该接口在mock系统中未匹配到Ip地址，不支持mock系统转发，请使用模拟数据或者直接请求后端。'
              },
            }
          ];
        } else {
          result = await Promise.all([
            ctx.doCurl(`${ctx.request.headers['x-scheme']}://${ipAddress}${port ? `:${port}`: ''}${ctx.url}`, {
              data: params,
              method: ctx.request.method,
              contentType: ctx.request.headers['x-content-type'],
            }),
          ]);
          const urlResponse = {
            system: urlObj.host,
            url: urlObj.url,
            type: urlObj.type,
            dataType: 'backend_data',
            createTime: dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            response: result[0].data,
          };
          await this.ctx.model.UrlResponse.create(urlResponse);
        }
      }
      if (urlObj.requestTarget === 'mock') {
        result = await ctx.service.urlResponse.getResponse(urlObj);
      }
      ctx.set('Access-Control-Expose-Headers', 'Set-Cookie');
      ctx.set('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Referer,User-Agent,TOKEN');
      ctx.set('Access-Control-Allow-Credentials', 'true');
      ctx.set('Access-Control-Allow-Methods', '*');
      ctx.set('Access-Control-Allow-Origin', 'https://deverp.szlcsc.com');
      if (Array.isArray(result)) {
        ctx.body = result[0].data;
      } else {
        ctx.body = new Response(402, result, null);
      }
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};
