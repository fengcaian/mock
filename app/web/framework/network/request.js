'use strict';
import axios from 'axios';
axios.defaults.timeout = 15000;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'x-csrf-token';
axios.defaults.xsrfCookieName = 'csrfToken';

export default {
  post(url, json) {
    return axios.post(url, json);
  },
  get(url, params) {
    return axios.get(url, { params });
  }
};