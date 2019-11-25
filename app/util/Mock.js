'use strict';

const { type, dateFormat } = require('./common');
const { LETTER } = require('./constant');

module.exports = class Mock {
  constructor() {}
  mock(dataModel) {
    let obj = {
      code: 200,
      msg: 'success',
    };
    if (type(dataModel.result) === 'Object') {
      obj.result = this.getObjectData(dataModel.result);
    } else if (type(dataModel.result) === 'Array') {
      obj.result = [this.getObjectData(dataModel.result)];
    } else {
      obj.result = undefined;
    }
    return obj;
  }
  getObjectData(obj) {
    const result = {};
    Object.keys(obj).forEach((key) => {
      switch (obj[key].type) {
        case 'string':
          if (obj[key].format === 'date-time') {
            result[key] = dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
          } else {
            result[key] = this.getRandomLetterStr(12);
          }
          break;
        case 'integer':
          result[key] = Math.floor(Math.random() * 100);
          break;
        default:
          result[key] = obj[key].description;
          break;
      }
    });
    return result;
  }
  getRandomLetterStr(length = 10) {
    let str = '';
    for (let i = 0; i < length; i += 1) {
      str += LETTER[Math.floor(Math.random() * 26)];
    }
    return str;
  }
};
