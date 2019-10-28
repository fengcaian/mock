'use strict';
const egg = require('egg');

module.exports = class UrlService extends egg.Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
  }
  async getUrlAllList(json = {}) {
    const { title, categoryId, status, pageIndex, pageSize } = json;
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
            urlObj.responses['200'].schema.$ref = _analysisDefinitions(definitions[$ref.slice(14)]);
            console.log(urlObj);
        }
        dataList.push(urlObj);
    });

    function _analysisDefinitions(obj) {
        Object.keys(obj).forEach((key) => {
            if (key === '$ref' && obj[key].startsWith('#/definitions/')) {
                obj[key] = definitions[obj[key].slice(14)];
                if (obj[key] && typeof obj[key] === 'object') {
                    _analysisDefinitions(obj[key]);
                }
            }
        });
        return obj;
    }
    this.ctx.model.Url.create(dataList, (a, b) => {
        console.log(a);
        console.log(b);
    });
    console.log(dataList[0].responses['200']);
    return dataList;
  }
};
