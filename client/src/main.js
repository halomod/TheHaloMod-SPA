import Vue from 'vue';
import App from './App.vue';
import router from './router';
import API from './utils/API';
import IDB from './utils/IDB';

Vue.config.productionTip = false;
const db = new IDB();
Vue.prototype.$db = db;
Vue.prototype.$http = new API(db);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
