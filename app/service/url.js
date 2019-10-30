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
      console.log(body);
      let result = null;
      await this.ctx.model.Url.remove({ _id: body._id }, (msg) => {
          console.log(msg);
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
  async mockData(body = {}) {
    const bodyLocal = {
        "type": "object",
        "properties": {
            "code": {
                "type": "integer",
                "format": "int32",
                "description": "状态码"
            },
            "msg": {
                "type": "string",
                "description": "返回消息"
            },
            "result": {
                "description": "返回结果",
                "$ref": {
                    "type": "object",
                    "properties": {
                        "dingUserId": {
                            "type": "string",
                            "description": "钉钉用户id"
                        },
                        "dingUserName": {
                            "type": "string",
                            "description": "钉钉用户姓名"
                        },
                        "erpUserId": {
                            "type": "integer",
                            "format": "int32",
                            "description": "erp用户id"
                        },
                        "userId": {
                            "type": "integer",
                            "format": "int32",
                            "description": "主键"
                        },
                        "workNumber": {
                            "type": "string",
                            "description": "工号"
                        }
                    },
                    "title": "UserModel"
                }
            }
        },
        "title": "ResultVO«UserModel»",
        "description": "通用返回结果VO"
    };
  }
};
