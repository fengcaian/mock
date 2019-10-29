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
            urlObj.responses['200'].schema.$ref = _analysisResult(definitions[$ref.slice(14)]);
        }
        dataList.push(urlObj);
    });

    function _analysisResult(obj) {
        // Object.keys(obj).forEach((key) => {
        //     if (key === '$ref' && obj[key].startsWith('#/definitions/')) {
        //         obj[key] = definitions[obj[key].slice(14)];
        //         if (obj[key] && typeof obj[key] === 'object') {
        //             _analysisDefinitions(obj[key]);
        //         }
        //     }
        // });
        const { result } = obj.properties;
        let voStr = '';
        if (result && typeof result.$ref === 'string') {
            console.log(result.$ref);
            const resultRefStr = result.$ref;
            if (resultRefStr.indexOf('«') === -1) {
                obj.properties.result.$ref = definitions[resultRefStr.slice(14)];
            } else if (resultRefStr.indexOf('List') === -1 && resultRefStr.indexOf('Map') === -1) {
                voStr = resultRefStr.match(new RegExp(/(?<=«).*?(?=»)/))[0];
                console.log(voStr);
                obj.properties.result.$ref = definitions[voStr];
            } else if (resultRefStr.indexOf('List') !== -1) {
                voStr = resultRefStr.match(new RegExp(/(?<=List«).*?(?=»)/))[0];
                obj.properties.result.$ref = definitions[voStr];
            }
        }
        return obj;
    }
    this.ctx.model.Url.create(dataList);
    return dataList;
  }
  async getUrlList(body = {}) {
      const result = await Promise.all([
          this.ctx.model.Url.count(true),
          this.ctx.model.Url.find()
              .sort({ id: -1 })
              .skip((Number(body.currentPage) - 1) * Number(body.pageSize))
              .limit(Number(body.pageSize)),
      ]);
      return {
          totalRow: result[0],
          dataList: result[1],
      };
  }
  async delete(json = {}) {
      console.log(json);
      let result = null;
      await this.ctx.model.Url.remove({ _id: json._id }, (msg) => {
          console.log(msg);
          result = msg;
      });
      return result;
  }
  async batchDelete(json = {}) {
      let result = null;
      await this.ctx.model.Url.remove(null, (msg) => {
          console.log(msg);
          result = msg;
      });
      return result;
  }
};
