'use strict';

import * as Type from './mutation-type';
import Vue from 'vue';
import Vuex from 'vuex';
import request from 'framework/network/request';

Vue.use(Vuex);

const actions = {

  SET_ARTICLE_LIST: (store, json) => {
    return request.post('/mock/api/article/list', json, store).then(response => {
      store.commit(Type.SET_ARTICLE_LIST, response.data);
    });
  },
  SET_ARTICLE_DETAIL: (store, { id }) => {
    const { commit, dispatch, state } = store;
    return request.get(`/mock/api/article/${id}`)
      .then(response => {
        commit(Type.SET_ARTICLE_DETAIL, response.data);
      });
  },
  SET_SAVE_ARTICLE: (store, json) => {
    const { commit, dispatch, state } = store;
    return request.post('/mock/api/article/add', json, store).then(response => {
      commit(Type.SET_SAVE_ARTICLE, json);
    });
  },
  DELETE_ARTICLE: (store, { id }) => {
    // 鉴权 TODO
    const { commit, dispatch, state } = store;
    return request.get(`/mock/api/article/del/${id}`, store)
      .then(response => {
        commit(Type.DELETE_ARTICLE, { id });
      });
  },
  SetShareData: (context, shareData) => {
    context.commit('SET_SHARE_DATA', shareData);
}
};

export default actions;