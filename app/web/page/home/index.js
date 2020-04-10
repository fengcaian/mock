import App from '../../framework/app';
import index from './index.vue';
import createRouter from './router';
import createStore from './store';
import '@/app/web/framework/utils/common/icons';

new App({ index, createRouter, createStore }).bootstrap();