import Store from '@/utils/Store.js';
import DEFAULT_MODEL from '@/constants/initial_state.json';
import Vue from 'vue';
import makeServer from '../mockServer';

// Disable dev notice info logs. Just a quality of life thing.
Vue.config.productionTip = false;
Vue.config.devtools = false;

// Setup a fake indexedDB because `window` does not exist while testing.
require('fake-indexeddb/auto');

describe('Store tests', () => {
  // Server initialization and shutdown
  let server;
  beforeEach(() => {
    server = makeServer('test');
  });
  afterEach(() => {
    server.shutdown();
  });

  // Store startup
  let store;
  beforeAll(async () => {
    store = new Store();
    expect(store).toBeDefined();
    await store.init();
    expect(store.state.plotType).toBeDefined();
  });

  test('Store should be initialized', () => {
    expect(store.state.plotType).toBeDefined();
  });

  test('Store should retrieve no model names if no models have been added', () => {
    expect(store.getModelNames().length === 0).toBeTruthy();
  });

  test('Store should be able to create models and return them', async () => {
    const testModelName1 = 'Some test model';
    await store.createModel(DEFAULT_MODEL, testModelName1);
    expect(store.getModelNames().length === 1).toBeTruthy();
    await store.createModel(DEFAULT_MODEL, 'Some other test model');
    expect(store.getModelNames()).toContain(testModelName1);
  });
});
