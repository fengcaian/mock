'use strict'

const egg = require('egg');
// const sendToWormhole = require('stream-wormhole');
const XLSX = require('xlsx');
const Response = require('../util/Response');

module.exports = class fileManageController extends egg.Controller {
  async analyse(ctx) {
    try {
      const stream = await ctx.getFileStream();
      const buffers = [];
      console.log(stream.fields);
      let res = {};
      await new Promise(resolve => {
        stream.on('data', chunk => {
          buffers.push(chunk);
        }).on('end', () => {
          const buffer = Buffer.concat(buffers);
          const workbook = XLSX.read(buffer, { type: 'buffer' });
          const sheetName = workbook.SheetNames;
          for (let sn of sheetName) {
            res[sn] = XLSX.utils.sheet_to_json(workbook.Sheets[sn], {
              raw: true,
              header: 1,
            });
          }
          resolve();
        }).on('error', err => {
          throw err;
        })
      });
      ctx.set('Content-Type', 'application/json; charset=utf-8');
      ctx.body = new Response(200, null, res);
      // 读取的文件数据
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};