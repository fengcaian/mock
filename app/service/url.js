'use strict';
const egg = require('egg');
const { type } = require('../util/common');

module.exports = class UrlService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async getUrlAllList(body = {}) {
    const [systemList] = await Promise.all([
      this.ctx.model.System.find()
    ]);
    const promises = [];
    if (!systemList.length) {
      return;
    }
    systemList.filter(system => system.isEnabled).forEach((item) => {
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
        const { schema } = urlObj.responses['200'];
        if (schema) {
          const { $ref } = schema;
          if ($ref) {
            urlObj.responses['200'] = recursiveObject(definitions[$ref.slice(14)].properties, definitions);
          }
        }
        urlObj.requestTarget = 'backend';
        urlObj.host = `${item.res.requestUrls[0].split('//')[0]}//${host}`;
        dataList.push(urlObj);
      });
    });

    function recursiveObject(o, definitions) {
      let result = {};
      let object = o;
      const { $ref } = o;
      if (type($ref) === 'String') {
        object = definitions[$ref.slice(14)].properties;
      }
      Object.keys(object).forEach((key) => {
        let value = object[key];
        if (type(value) === 'Object') {
          if (value.type === 'array') {
            result[key] = [recursiveObject(value.items || {}, definitions)];
          } else {
            result[key] = recursiveObject(value, definitions);
          }
        } else {
          result[key] = value;
        }
      });
      return result;
    }

    this.ctx.model.Url.create(dataList);
    return dataList;
  }
  async getUrlList(query = {}) {
    const list = await Promise.all([
      this.ctx.model.Url.count(true),
      this.ctx.model.Url.find()
        .sort({ id: -1 })
        .skip((Number(query.currentPage) - 1) * Number(query.pageSize))
        .limit(Number(query.pageSize)),
    ]);
    let result = JSON.parse(JSON.stringify(list));
    result[1].forEach((item) => {
      delete item.produces;
      delete item.operationId;
      delete item.__v;
      delete item.deprecated;
    });
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
