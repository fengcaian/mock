'use strict';

module.exports = app => {
  const exports = {};

  exports.vuessr = {
    injectCss: true
  };

  exports.static = {
    maxAge: 0,
    prefix: '/static', // 不配置，图片引用不到
    dynamic: true, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和‘preload’配合使用
  };

  return exports;
};