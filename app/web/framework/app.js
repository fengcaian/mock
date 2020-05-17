import Vue from 'vue';
import { sync } from 'vuex-router-sync';

 export default class App {
   constructor(config) {
     this.config = config;
   }

   bootstrap() {
     const options = this.create();
     const app  = new Vue(options);
     app.$mount('#app');
   }

   fetch(store, router) {
     const matchedComponents = router.getMatchedComponents();
     if (!matchedComponents) {
       return Promise.reject('No Match Component');
     }
     return Promise.all(
       matchedComponents.map(component => {
         if (component.methods && component.methods.fetchApi) {
           return component.methods.fetchApi.call(component, { $store: store, $router: router });
         }
         return null;
       })
     );
   }

   create() {
     const { index, options, createRouter, createStore } = this.config;
     const router = createRouter();
     const store = createStore();
     router.afterEach(() => {
       this.fetch(store, router);
     });
     sync(store, router);
     return {
       ...index,
       ...options,
       router,
       store
     }
   }

   async willReady() {
     // 所有的插件都已启动完毕，但是应用整体还未 ready
     // 可以做一些数据初始化等操作，这些操作成功才会启动应用

     // 例如：从数据库加载数据到内存缓存
     this.app.cacheData = await this.app.model.query(QUERY_CACHE_SQL);
   }

   async serverDidReady() {
     console.log('egg server is closed');
   }
 };