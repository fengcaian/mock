'use strict';
const path = require('path');
const fs = require('fs');
module.exports = app => {
  const exports = {};

  exports.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/images/favicon.ico'))
  };

  exports.vuessr = {
    layout: path.join(app.baseDir, 'app/web/view/layout.html')
  };

  exports.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(app.baseDir, 'logs')
  };

  exports.static = {
    prefix: '/public/',
    dir: path.join(app.baseDir, 'public')
  };

  exports.keys = '123456';

  exports.middleware = [
    'locals',
    'access'
  ];

  exports.security = {
    csrf: {
      ignoreJSON: false,
      cookieName: 'csrfToken',
      // sessionName: 'csrfToken',
      // headerName: 'x-csrf-token'
    },
    xframe: {
      enable: false,
    },
  };

  //config中配置mongose连接mongodb数据库
  //Mongodb://eggadmin:123456@localhost:27017 //有用户名密码的情况
  exports.mongoose = {
    client: {
      url: 'mongodb://localhost/mock',  //你的数据库地址，不要端口
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }
  };

  exports.apiUrl = 'https://fatdingding.szlcsc.com';

  return exports;
};