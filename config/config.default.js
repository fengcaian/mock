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
  return exports;
};
