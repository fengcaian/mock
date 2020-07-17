'use strict';

import {
  SET_ARTICLE_LIST,
  SET_ARTICLE_DETAIL,
  SET_SAVE_ARTICLE,
  DELETE_ARTICLE
} from './mutation-type';

const mutations = {
  SET_SHARE_DATA(state, shareData) {
    state.shareData = shareData;
  },
  SET_AFTER_ADD_PAGE(state, afterAddPage) {
    state.afterAddPage = afterAddPage;
  }
};
export default mutations;
