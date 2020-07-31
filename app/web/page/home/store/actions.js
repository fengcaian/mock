'use strict';

import * as Type from './mutation-type';
import Vue from 'vue';
import Vuex from 'vuex';
import request from 'framework/network/request';

Vue.use(Vuex);

const actions = {
  SetShareData: (context, shareData) => {
    context.commit('SET_SHARE_DATA', shareData);
  },
  SetG6Editor: (context, g6Editor) => {
    context.commit('SET_G6_EDITOR', g6Editor);
  }
};

export default actions;