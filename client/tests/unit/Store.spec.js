import Store from '@/utils/Store.js';

// Setup a fake indexedDB because `window` does not exist while testing. This
// logs to the console that vue is in dev mode because it thinks there is a
// browser.
require('fake-indexeddb/auto');

describe('Store tests', () => {
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
    expect(store.getModelNames.length === 0).toBeTruthy();
  });
});
