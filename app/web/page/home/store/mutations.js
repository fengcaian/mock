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
  }
};
export default mutations;
