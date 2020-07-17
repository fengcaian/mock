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
  SetAfterAddPage: (context, afterAddPage) => {
    context.commit('SET_AFTER_ADD_PAGE', afterAddPage);
  }
};

export default actions;