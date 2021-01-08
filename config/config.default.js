'use strict';
const path = require('path');
const fs = require('fs');
// import fs from 'fs';

module.exports = app => {
  const exports = {};
  exports.keys = '123456789';

  exports.vuessr = {
    layout: path.join(app.baseDir, 'app/web/view/layout.html')
  };

  exports.multipart = {
    fileExtensions: ['.xlsx', '.xls', '.csv'], // 增加对额外扩展名的文件支持（文件上传用到）
  };

  exports.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(app.baseDir, 'logs')
  };

  exports.static = {
    prefix: '/public',
    dir: path.join(app.baseDir, 'public')
  };

  exports.security = {
    csrf: {
      ignoreJSON: false,
      cookieName: 'csrfToken',
      headerName: 'x-csrf-token'
    },
    xframe: {
      enable: false,
    }
  };

  exports.mongoose = {
    client: {
      url: 'mongodb://localhost/mock',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
    }
  };

  exports.bodyParser = {
    jsonLimit: '10mb', // 异步请求参数的大小限制
    formLimit: '6mb',
  };

  exports.middleware = ['gzip',];
  exports.gzip = {
    threshold: 1024, // 小于 1k 的响应体不压缩
  };
  return exports;
};
