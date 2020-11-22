import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import IDB from './utils/IDB';

Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
Vue.prototype.$http = axios;

Vue.prototype.$db = new IDB();

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
