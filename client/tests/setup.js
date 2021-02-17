import Vue from 'vue';
import VueMaterial from 'vue-material';
import VueObserveVisibility from 'vue-observe-visibility';

Vue.use(VueMaterial);
Vue.use(VueObserveVisibility);

global.console = {
  warn: jest.fn(),
  log: console.log,
  info: console.info,
  debug: console.debug,
  error: console.error,
}
