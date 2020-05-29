'use strict';

const egg = require('egg');
const Response = require('../util/Response');
const { dateFormat } = require('../util/common');

module.exports = class UrlController extends egg.Controller {
  async forward(ctx) {
    try {
      if (ctx.request.headers.origin === 'https://deverp.szlcsc.com' || ctx.request.headers.origin === 'https://devpda.szlcsc.com') {
        ctx.set('Access-Control-Expose-Headers', 'Set-Cookie');
        ctx.set('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Referer,User-Agent,TOKEN');
        ctx.set('Access-Control-Allow-Credentials', 'true');
        ctx.set('Access-Control-Allow-Methods', '*');
        ctx.set('Access-Control-Allow-Origin', ctx.request.headers.origin);
      } else {
        ctx.body = new Response(402, '该系统不支持跨域', null);
      }
      let port = ctx.request.headers['x-forwarded-port'];
      let { host } = ctx.request.headers;
      const scheme = ctx.request.headers['x-scheme'];
      const proxySystem = this.app.proxySystemList.find((item => item.tempHost === host));
      if (proxySystem) { // 不是通过swagger获取的url
        host = proxySystem.tempHost.replace(proxySystem.prefix, '');
        await this.ctx.service.url.urlAddByHand({
          host,
          hostIp: '127.0.0.1',
          summary: host,
          type: ctx.request.method,
          url: ctx.url,
          requestTarget: 'backend',
          source: 'byAutoProxy',
        });
        const result = this.ctx.service.urlForward.goToBackend({
          url: `${ctx.request.headers['x-scheme']}://${host}${port ? `:${port}`: ''}${ctx.url}`,
          params: {
            data: ctx.request.headers['x-content-type'] === 'application/json;charset=UTF-8' ? JSON.stringify(ctx.request.body) : ctx.request.body,
            method: ctx.request.method,
            contentType: ctx.request.headers['x-content-type'],
          }
        });
        if (result) {
          await this.ctx.service.urlForward.backUpBackendData({ // 将后端返回的数据备份下来
            host: urlObj.host,
            url: urlObj.url,
            type: urlObj.type,
            data: result.data,
          });
        }
      } else {
        const url = ctx.url.split('?')[0];
        let params, result = {};
        let ipAddress = '';
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
            result = this.ctx.service.urlForward.goToBackend({
              url: `${ctx.request.headers['x-scheme']}://${ipAddress}${port ? `:${port}`: ''}${ctx.url}`,
              params: {
                data: params,
                method: ctx.request.method,
                contentType: ctx.request.headers['x-content-type'],
              }
            });
            if (result) {
              await this.ctx.service.urlForward.backUpBackendData({
                host: urlObj.host,
                url: urlObj.url,
                type: urlObj.type,
                data: result.data,
              });
            }
          }
        }
        if (urlObj.requestTarget === 'mock') {
          result = await ctx.service.urlResponse.getResponse(urlObj);
        }
        if (Array.isArray(result)) {
          ctx.body = result[0].data;
        } else {
          ctx.body = new Response(402, result, null);
        }
      }
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};
