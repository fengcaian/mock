'use strict';

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
};