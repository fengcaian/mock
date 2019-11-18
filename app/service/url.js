'use strict';
const egg = require('egg');
const { type } = require('../util/common');

module.exports = class UrlService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async getUrlAllList(body = {}) {
    const [ systemList ] = await Promise.all([
      this.ctx.model.System.find()
    ]);
    const promises = [];
    if (!systemList.length) {
      return;
    }
    systemList.forEach((item) => {
      promises.push(this.ctx.doCurl(`${item.systemUrl}/v2/api-docs`));
    });
    const result = await Promise.all(promises);
    if (!result.length) {
      return;
    }
    const dataList = [];
    result.forEach(item => {
      const { data } = item;
      const { paths, definitions, host } = data;
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
        // analyse(urlObj.responses['200'], {});
        const { schema } = urlObj.responses['200'];
        if (schema) {
          const { $ref } = schema;
          if ($ref) {
            const def = {};
            recursiveObject(definitions[$ref.slice(14)], def, definitions);
            // _analysisRef(definitions[$ref.slice(14)], def, definitions);
            urlObj.responses['200'].schema.$ref = def;
          }
        }
        urlObj.requestTarget = 'backend';
        urlObj.host = host;
        dataList.push(urlObj);
      });
    });

    function analyse(res, result, definitions) {
      Object.keys(res).forEach((key) => {
        if (typeof res[key] === 'object') {
          result[key] = {};
          analyse(res[key], result[key]);
        } else if (key === '$ref') {
          const def = {};
          analysisDefinitions(res[key], def, definitions);
          result[key] = def;
        } else {
          result[key] = res[key];
        }
      });
    }
    function analysisDefinitions($refStr, def, definitions) {
      let defStr = $refStr.slice(14);
      if (type(definitions[defStr]) === 'Object') {
        Object.keys(definitions[defStr]).forEach((key) => {
          def[key] = {};
          analysisDefinitions(definitions[defStr][key], def[key]);
        });
      }
    }

    function recursiveObject(object, result, definitions) {
      Object.keys(object).forEach((key) => {
        if (type(object[key]) === 'Object') {
          result[key] = {};
          recursiveObject(object[key], result[key], definitions);
        } else if (key === '$ref') {
          const def = definitions[object[key].slice(14)];
          result[key] = {};
          recursiveObject(def, result[key], definitions);
        } else {
          result[key] = object[key];
        }
      });
    }

    function _analysisRef(o, result, definitions) {
      Object.keys(o).forEach(key => {
        if (typeof o[key] === 'object') {
          result[key] = {};
          _analysisRef(o[key], result[key], definitions);
        } else if (key === '$ref') {
          result[key] = _analysisDefinitions(o[key], definitions);
        } else {
          result[key] = o[key];
        }
      });
    }

    function _analysisDefinitions($refStr, definitions) {
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
