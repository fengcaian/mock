'use strict';
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '.', dir);
}
module.exports = {
  egg: true,
  devtool: 'eval',
  target: 'web',
  entry: {
    admin: 'app/web/page/admin/index.js'
  },
  cssExtract: true,
  dll: ['vue', 'vue-router', 'vuex', 'axios', 'vuex-router-sync', 'vue-i18n'],
  plugins: {
    imagemini: false
  },
  alias: {
    '@': __dirname,
  },
  loaders: {
    urlimage: {
      test: /\.(png|jpe?g|gif)(\?.*)?$/, // 去掉url-loader对svg文件的处理
    },
    svg: {
      test: /\.svg$/,
      loader: 'svg-sprite-loader',
      options: {
        symbolId: 'icon-[name]',
      },
      include: resolve('app/web/asset/svg'),
    },
  }
};