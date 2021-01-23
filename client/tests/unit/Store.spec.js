import Store from '@/utils/Store.js';
import Dexie from 'dexie';
import indexedDB from 'fake-indexeddb';

// Setup a fake indexedDB because `window` does not exist while testing.
Dexie.dependencies.indexedDB = indexedDB;

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
