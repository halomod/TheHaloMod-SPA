import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import deepcopy from './utils/deepcopy';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

Vue.mixin({
  methods: {
    deepcopy,
  },
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
