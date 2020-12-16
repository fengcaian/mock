'use strict';
const egg = require('egg');
const { type, deepCopy } = require('../util/common');

module.exports = class UrlService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async getUrlAllList(body = {}) {
    const ip = body.ipAddressList[0].value;
    if (!body.systemUrl || !body.systemApi || !ip) {
      return 'ip地址或api不存在！';
    }
    const protocol = body.systemUrl.split(':')[0];
    const portList = body.systemUrl.match(/(?<=:)\d+/);
    let port = '';
    if (portList && portList.length) {
      port = portList[0];
    }
    // const result = await Promise.all([this.ctx.doCurl(`${protocol}://${ip}${port ? `:${port}` : ''}${body.systemApi}`, { method: 'GET' })]);
    const result = await Promise.all([this.ctx.doCurl(`${body.systemUrl}${body.systemApi}`, { method: 'GET' })]);
    if (!result.length) {
      return;
    }
    console.log(`${protocol}://${ip}${port ? `:${port}` : ''}${body.systemApi}`);
    console.log(`${body.systemUrl}${body.systemApi}`);
    console.log(`${protocol}://${ip}${body.systemApi}`);
    console.log(body.port);
    console.log(result);
    const dataList = [];
    if (!result[0].data) {
      return;
    }
    result.forEach((item, index) => {
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
        urlObj.host = body.systemUrl;
        urlObj.hostIp = ip;
        urlObj.source = 'swagger';
        dataList.push(urlObj);
      });
    });

    function recursiveObject(o, definitions, parent = null) {
      let result = {};
      if (!o) {
        return result;
      }
      let object = o;
      let _parent = parent;
      const { $ref } = o;
      if (type($ref) === 'String' && definitions[$ref.slice(14)]) {
        object = definitions[$ref.slice(14)].properties;
      }
      if (!object) {
        return;
      }
      while (_parent) {
        if (_parent.originParent === o) {
          // return _parent.currentParent;
          return {};
        }
        _parent = _parent.parent;
      }
      Object.keys(object).forEach((key) => {
        let value = object[key];
        if (type(value) === 'Object') {
          if (value.type === 'array') {
            result[key] = [recursiveObject(value.items || {}, definitions, {
              originParent: o,
              currentParent: result,
              parent,
            })];
          } else {
            result[key] = recursiveObject(value, definitions);
          }
        } else {
          result[key] = value;
        }
      });
      return result;
    }
    if (dataList.length) {
      await this.ctx.model.Url.remove({ host: body.systemUrl });
    }
    console.log(body.systemUrl);
    this.ctx.model.Url.create(dataList);
    return dataList;
  }
  async getUrlList(query = {}) {
    const params = {};
    if (query.url) {
      params.url = {
        $regex: query.url,
      };
    }
    if (query.system) {
      params.host = {
        $regex: query.system,
      };
    }
    if (query.summary) {
      params.summary = new RegExp(query.summary, 'i');
    }
    const list = await Promise.all([
      this.ctx.model.Url.countDocuments(params),
      this.ctx.model.Url.find(params)
        .sort({ createTime: -1 })
        .skip((Number(query.currentPage) - 1) * Number(query.pageSize))
        .limit(Number(query.pageSize)),
    ]);
    let result = deepCopy(list);
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
  async update(body = {}) {
    let result = null;
    const params = deepCopy(body);
    delete params._id;
    console.log(params);
    await this.ctx.model.Url.update({ _id: body._id }, { $set: params }, (msg) => {
      result = msg;
    });
    return result;
  }
  async batchDelete(body = {}) {
    let result = null;
    const _ids = body._ids.split(',');
    await this.ctx.model.Url.remove({ _id: { $in: _ids }}, (msg) => {
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
  async getUrlSingle(host, url, type) {
    try {
      const result = await this.ctx.model.Url.find({ url, type });
      return result.length ? result[0] : {};
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }
  async urlAddByHand(body = {}) {
    console.log(body);
    const url = {
      requestTarget: 'mock',
      source: 'byHand',
    };
    Object.assign(url, body);
    try {
      return await this.ctx.model.Url.create(url);
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }
};
