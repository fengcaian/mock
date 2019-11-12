'use strict';

const egg = require('egg');

module.exports = class systemService extends egg.Service {
  async getSystemList(query = {}) {
    const result = await Promise.all([
      this.ctx.model.System.count(true),
      this.ctx.model.System.find()
        .sort({ id: -1 })
        .skip((Number(query.currentPage) - 1) * Number(query.pageSize))
        .limit(Number(query.pageSize)),
    ]);
    return {
      totalRow: result[0],
      dataList: result[1],
    };
  }
  async add(body = {}) {
    console.log(body);
    await this.ctx.model.System.create(body);
  }
  async delete(body = {}) {
    let result = null;
    await this.ctx.model.System.remove({ _id: body._id }, (msg) => {
      result = msg;
    });
    return result;
  }
};
