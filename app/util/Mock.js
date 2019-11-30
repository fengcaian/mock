'use strict';

const { type, dateFormat } = require('./common');
const { LETTER } = require('./constant');

module.exports = class Mock {
  constructor() {}
  mock(dataModel) {
    console.log(dataModel);
    const that = this;
    function recursiveObject(o) {
      if (type(o) === 'Object' && o.type === undefined) { //有type属性的认为是最底层的数据节点
        let newO = {};
        Object.keys(o).forEach((key) => {
          newO[key] = typeof o[key] === 'object' ? recursiveObject(o[key]) : o[key];
        });
        return newO;
      } else if (type(o) === 'Array') {
        let newArr = [];
        if (o.length) {
          o.forEach((item, i) => {
            if (type(o) === 'Array' || type(o) === 'Object' && o.type === undefined) {
              newArr[i] = recursiveObject(item);
            } else {
              newArr[i] = that.randomValue(item);
            }
          });
        }
        return newArr;
      } else if (type(o) === 'Object') {
        return that.randomValue(o);
      } else {
        return 200;
      }
    }
    return recursiveObject(dataModel);
  }
  randomValue(obj) {
    let s = '';
    switch (obj.type) {
      case 'string':
        if (obj.format === 'date-time') {
          s = dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
        } else {
          s = this.getRandomLetterStr(12);
        }
        break;
      case 'integer':
        s = Math.floor(Math.random() * 100);
        break;
      default:
        s = obj.description;
        break;
    }
    return s;
  }
  getRandomLetterStr(length = 10) {
    let str = '';
    for (let i = 0; i < length; i += 1) {
      str += LETTER[Math.floor(Math.random() * 26)];
    }
    return str;
  }
};
