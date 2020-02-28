import App from 'framework/app';
import createI18n from 'framework/i18n/admin';
import createStore from './store';
import createRouter from './router';
import '@/app/web/framework/utils/common/icons';
import index from './index.vue';

new App({ index, createI18n, createRouter, createStore, testParams: 666 }).bootstrap();


