'use strict';

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '.', dir);
}

module.exports = {
  egg: true,
  framework: 'vue',
  entry: {
    include: ['app/web/page'], // 自动遍历 app/web/page 目录下的 js 文件入口
    exclude: ['app/web/page/[a-z]+/component'],
  },
  cssExtract: true,
  devtool: 'source-map',
  productionSourceMap: false,
  alias: {
    '@': __dirname,
    asset: 'app/web/asset',
    component: 'app/web/component',
    framework: 'app/web/framework',
    store: 'app/web/store'
  },
  dll: ['vue/dist/vue.common.js', 'axios'], // webpack dll 构建
  install:{
    npm: 'npm', // 默认是 npm, 可以是 cnpm
    check: true // 默认为禁用，自动安装缺少的 loader 和 plugin，建议首次 运行成功后，改成 false，加快构建速度
  },
  loaders: {
    eslint: false,
    urlimage: {
      test: /\.(png|jpe?g|gif)(\?.*)?$/, // 去掉url-loader对svg文件的处理
      options: {
        limit: 1024,
        esModule: false // 解决img图像src变成"[object Module]"无法正确加载
      }
    },
    svg: {
      test: /\.svg$/,
      loader: 'svg-sprite-loader',
      options: {
        symbolId: 'icon-[name]',
      },
      include: resolve('app/web/asset/svg'),
    },
  },
  plugins: {},
  done() { // 编译完成回调

  }
};
