'use strict';
const egg = require('egg');

module.exports = class UrlService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async getUrlAllList(body = {}) {
    const [ result ] = await Promise.all([
      this.ctx.doCurl('/v2/api-docs', {
        data: this.query,
      }),
    ]);
    const { data } = result;
    const { paths, definitions } = data;
    const dataList = [];
    let obj = {}; // { url: '', [post/get/delete...]: {} }
    Object.keys(paths).forEach(key => {
      obj = Object.assign({}, paths[key]);
      obj.url = key;
      const urlObj = {}; // { url: '', type: 'post/get', ...{} }
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] !== 'string') { // post或者get或者其他类型参数对象
          urlObj['type'] = key;
          Object.keys(obj[key]).forEach(k => {
              urlObj[k] = obj[key][k];
          });
        } else { // url
          urlObj[key] = obj[key];
        }
      });
      const { $ref } = urlObj.responses['200'].schema;
      if ($ref) {
        const def = {};
        _analysisRef(definitions[$ref.slice(14)], def);
        urlObj.responses['200'].schema.$ref = def;
      }
      urlObj.requestTarget = 'backend';
      dataList.push(urlObj);
    });

    function _analysisRef(o, result) {
      Object.keys(o).forEach(key => {
        if (typeof o[key] === 'object') {
          result[key] = {};
          _analysisRef(o[key], result[key]);
        } else if (key === '$ref') {
          result[key] = _analysisDefinitions(o[key]);
        } else {
          result[key] = o[key];
        }
      });
    }

    function _analysisDefinitions($refStr) {
      let def = {};
      if ($refStr.indexOf('«') === -1) {
        def = definitions[$refStr.slice(14)];
      } else if ($refStr.indexOf('List') === -1 && $refStr.indexOf('Map') === -1) {
          const str = $refStr.match(new RegExp(/(?<=«).*?(?=»)/))[0];
        def = definitions[str];
      } else if ($refStr.indexOf('List') !== -1) {
        const str = $refStr.match(new RegExp(/(?<=List«).*?(?=»)/))[0];
        def = definitions[str];
      }
      return def;
    }

    this.ctx.model.Url.create(dataList);
    return dataList;
  }
  async getUrlList(query = {}) {
    const result = await Promise.all([
      this.ctx.model.Url.count(true),
      this.ctx.model.Url.find()
        .sort({ id: -1 })
        .skip((Number(query.currentPage) - 1) * Number(query.pageSize))
        .limit(Number(query.pageSize)),
    ]);
    return {
      totalRow: result[0],
      dataList: result[1],
    };
  }
  async delete(body = {}) {
    let result = null;
    await this.ctx.model.Url.remove({ _id: body._id }, (msg) => {
      result = msg;
    });
    return result;
  }
  async batchDelete(body = {}) {
    let result = null;
    await this.ctx.model.Url.remove(null, (msg) => {
      console.log(msg);
      result = msg;
    });
    return result;
  }
  async requestTargetSwitch(body = {}) {
    const post = {
      requestTarget: body.requestTarget,
    };
    try{
      await this.ctx.model.Url.update({ _id: body._id }, post);
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }
};
