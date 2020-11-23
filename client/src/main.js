import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import IDB from './utils/IDB';
import API from './utils/API';

Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
Vue.prototype.$http = new API(new IDB());

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
