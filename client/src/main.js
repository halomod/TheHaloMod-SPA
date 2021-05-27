import Vue from 'vue';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import App from './App.vue';
import router from './router';
import Store from './utils/Store';

/**
 * Establishes the Sentry.io connection for error tracking.
 */
if (process.env.VUE_APP_SENTRY_ON !== 'FALSE') {
  Sentry.init({
    Vue,
    dsn: 'https://7a99f3aaaa144241960d3857a1f4dee9@o516709.ingest.sentry.io/5623500',
    integrations: [new Integrations.BrowserTracing()],
    tracingOptions: {
      trackComponents: true,
    },
    environment: process.env.NODE_ENV,
    autoBreadcrumbs: true,
  });
}

/**
 * The entry point for the Vue application. This notation of
 * ```
 * (() => {
 *  // Do something
 * })();
 * ```
 * creates an anonymous function and executes it immediately.
 */
(async () => {
  const store = new Store();
  await store.init();
  Vue.config.productionTip = false;
  Vue.prototype.$store = store;
  Vue.prototype.$theme = store.state.theme;

  new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app');
})();
