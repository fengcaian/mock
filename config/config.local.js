const path = require('path');
const ip = require('ip');
module.exports = app => {
  const exports = {};

  exports.view = {
    cache: false
  };

  exports.static = {
    maxAge: 0, // maxAge 缓存，默认 1 年
    prefix: '/static', // 不配置这个，图片引用不到
    dynamic: true, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用；
  };

  exports.development = {
    watchDirs: [], // 指定监视的目录（包括子目录），当目录下的文件变化的时候自动重载应用，路径从项目根目录开始写
    ignoreDirs: ['app/web', 'public', 'config/manifest.json'] // 指定过滤的目录（包括子目录）
  };

  exports.logview = {
    dir: path.join(app.baseDir, 'logs')
  };

  exports.vuessr = {
    injectCss: true
  };

  exports.webpack = {
    webpackConfigList: require('easywebpack-vue').getWebpackConfig()
  };

  const localIP = ip.address();
  const domainWhiteList = [];
  [7001, 9000, 9001].forEach(port => {
    domainWhiteList.push(`http://mock-swagger.com:${port}`);
  });

  exports.security = { domainWhiteList };

  return exports;
};
