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
  async getSystemSingle(systemUrl) {
    try {
      return await this.ctx.model.System.findOne({ systemUrl });
    } catch (e) {
      this.ctx.logger.error(e);
    }
  }
  async add(body = {}) {
    console.log(body);
    await this.ctx.model.System.create(body);
  }
  async update(body = {}) {
    let result = null;
    await this.ctx.model.System.update({ _id: body._id }, body);
    console.log(body.isUpdateUrlIp);
    console.log(body.systemUrl);
    console.log(body.ipAddressList[0].value);
    if (body.isUpdateUrlIp) {
      await this.ctx.model.Url.updateMany({ host: body.systemUrl }, { $set: { hostIp: body.ipAddressList[0].value } });
    }
    return result;
  }
  async delete(body = {}) {
    let result = null;
    await this.ctx.model.System.remove({ _id: body._id }, (msg) => {
      result = msg;
    });
    return result;
  }
  async enableSwitch(body = {}) {
    let result = null;
    await this.ctx.model.System.update({ _id: body._id }, body, (msg) => {
      result = msg;
    });
    return result;
  }
  async addIpAddress(body = {}) {
    let result = null;
    await this.ctx.model.System.update({ _id: body._id }, { $set: { ipAddressList: body.ipAddressList } }, (msg) => {
      result = msg;
    });
    return result;
  }
  async reloadSwaggerAPI(body = {}) {

  }
};
