import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Store from './utils/Store';

(async () => {
  const store = new Store();
  await store.init();
  Vue.config.productionTip = false;
  Vue.prototype.$store = store;

  new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app');
})();
