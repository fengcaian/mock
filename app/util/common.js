'use strict';

function type(param) {
  return Object.prototype.toString.call(param).slice(8, -1);
}

function dateFormat(date, fmt) {
  const d = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  Object.keys(d).forEach(key => {
    const reg = new RegExp(key);
    if (reg.test(fmt)) {
      fmt = fmt.replace(reg, ($1, $2) => (`${d[key]}`.length === 1 ? `0${d[key]}` : d[key]));
    }
  });
  return fmt;
}

module.exports = {type, dateFormat};
