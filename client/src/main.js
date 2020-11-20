import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import { init } from './utils/idb';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

init();

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
