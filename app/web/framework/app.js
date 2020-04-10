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
 };