import Vue from 'vue';
import VueMaterial from 'vue-material';
import VueObserveVisibility from 'vue-observe-visibility';

Vue.use(VueMaterial);
Vue.use(VueObserveVisibility);

// the following IGNORES vue console warnings during testing to avoid repeated warnings
// that libraries need browser polyfills to function when we're not using a browser */
global.console = {
  warn: jest.fn(),
  log: console.log,
  info: console.info,
  debug: console.debug,
  error: console.error,
};
