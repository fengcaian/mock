import Vue from 'vue';
import SvgIcon from '@/app/web/component/svg-icon';// svg组件

// register globally
Vue.component('svg-icon', SvgIcon);

const requireAll = requireContext => requireContext.keys().forEach(requireContext);
const req = require.context('../assets/svg', false, /\.svg$/);
console.log(req);

requireAll(req);
