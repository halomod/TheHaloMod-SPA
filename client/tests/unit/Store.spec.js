import Store from '@/utils/Store.js';

require('fake-indexeddb/auto');

describe('Store tests', () => {
  let store;

  beforeAll(async () => {
    store = new Store();
    expect(store).toBeDefined();
    await store.init();
    expect(store.state.plotType).toBeDefined();
  });

  test('This is a test example', () => {
    expect(store.state.plotType).toBeDefined();
  });
});
