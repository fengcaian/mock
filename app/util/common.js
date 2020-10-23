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

function deepCopy(n, parent = null, isAbandonCircleObj = true){
  const type = Object.prototype.toString.call(n).slice(8,-1);
  let _parent = parent;
  //该字段有父级则需要追溯该字段的父级
  while(_parent) {
    //如果该字段引用了它的父级，则为循环引用
    if(_parent.originParent === n) {
      //循环引用返回同级的新对象
      if (isAbandonCircleObj) {
        return {};
      }
      return _parent.currentParent;
    }
    _parent = _parent.parent
  }
  if(type === 'Array') {
    return n.slice(0);
  }else if(type === 'Object'){
    let newN = {};
    for(let k in n){
      if(n.hasOwnProperty(k)){
        newN[k]=typeof n[k] === 'object' ? deepCopy(n[k], {
          //递归执行深拷贝，将同级的待拷贝对象与新对象传递给parent，方便追溯循环引用
          originParent: n,
          currentParent: newN,
          parent: parent
        }) : n[k];
      }
    }
    return newN;
  }else{
    return n;
  }
}

module.exports = {type, dateFormat, deepCopy};
