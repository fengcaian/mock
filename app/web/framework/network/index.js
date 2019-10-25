import axios from 'axios';
import Vue from 'vue';

// axios.default.withCredentials = true;
axios.default.timeout = 5000;

// // request interceptor
// axios.interceptors.request.use((config) => {
//   // add token
//   // if (store.getters.token) {
//   //   config.headers.common.TOKEN = store.getters.token;
//   // }
//   return config;
// }, (error) => {
//   Promise.reject(error);
// });

// respone interceptor
axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 200) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response);
  },
  (error) => {
    console.log(`response error: ${error}`);// for debug
    // 统一错误返回格式
    const res = { message: error.message || '网络错误' };
    return Promise.reject(res);
  },
);
Vue.prototype.$axios = axios;
