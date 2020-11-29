import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Store from './utils/Store';

Vue.config.productionTip = false;
Vue.prototype.$store = new Store();

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
