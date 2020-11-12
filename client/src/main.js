import Vue from 'vue';
import App from './App.vue';
import router from './router';
import deepcopy from './utils/deepcopy';

Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    deepcopy,
  },
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
