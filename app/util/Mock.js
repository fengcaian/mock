'use strict';

const { type, dateFormat } = require('./common');
const { letter } = require('./constant');

module.exports = class Mock {
  constructor() {}
  mock(dataModel) {
    const { properties } = dataModel;
    let obj = {
      code: 200,
      msg: 'success',
    };
    if (properties.result && type(properties.result) === 'Object' && properties.result.$ref) {
      const { $ref } = properties.result;
      if ($ref.type === 'object') {
        obj.result = this.getObjectData($ref.properties);
      } else if ($ref.type === 'array') {
        obj.result = [this.getObjectData($ref.properties)];
      }
    } else if (type(properties.result) === 'Object') {
      obj.result = this.getObjectData(properties.result);
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
      str += letter[Math.floor(Math.random() * 26)];
    }
    return str;
  }
};
