'use strict';
const path = require('path');

function resolve(dir) {
  console.log(path.join(__dirname, '.', dir));
  console.log(path.resolve(__dirname, 'app/web/asset/svg'));
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
  // chainWebpack: (config) => {
  //   config.module
  //     .rule('svg')
  //     .exclude.add(resolve('app/web/asset/svg'))
  //     .end();
  //
  //   config.module
  //     .rule('icons')
  //     .test(/\.svg$/)
  //     .include.add(resolve('app/web/asset/svg'))
  //     .end()
  //     .use('svg-sprite-loader')
  //     .loader('svg-sprite-loader')
  //     .options({
  //       symbolId: 'icon-[name]',
  //     });
  // },
  // loaders: [
  //   {
  //     test : /\.svg$/,
  //     use: [
  //       {
  //         loader: 'svg-sprite-loader'
  //       }
  //     ],
  //     query: {
  //       symbolId: 'icon-[name]',
  //     },
  //     options: {},
  //     include: resolve('app/web/asset/svg'),
  //   }
  // ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        include: [
          resolve('app/web/asset'),
        ],
        loader: 'url-loader',
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-sprite-loader',
      //   use: 'svg-sprite-loader',
      //   options: {
      //     modules: true,
      //     symbolId: 'icon-[name]',
      //   },
      //   include: [path.resolve(__dirname, 'app/web/asset')],
      // },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [
          resolve('app/web'),
        ],
        options: {
          symbolId: 'icon-[name]'
        }
      }
    ]
  }
};