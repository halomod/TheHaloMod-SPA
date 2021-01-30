import { shallowMount, createLocalVue } from '@vue/test-utils';
import Graph from '@/components/Graph';
import Vue from 'vue';
import Store from '@/utils/Store.js';
import DEFAULT_MODEL from '@/constants/initial_state.json';
import makeServer from '../mockServer';

// Disable dev notice info logs. Just a quality of life thing.
Vue.config.productionTip = false;
Vue.config.devtools = false;

// Setup a fake indexedDB because `window` does not exist while testing.
require('fake-indexeddb/auto');

describe('Graph tests', () => {
  let server;
  let wrapper;
  beforeAll(async () => {
    server = makeServer('test');
    const localVue = createLocalVue();
    const store = new Store();
    await store.init();
    if (typeof store.state !== 'object') {
      throw new Error('Store wasn\'t initialized correctly in test. The store is'
      + ` ${JSON.stringify(store)}`);
    }
    // Mount the component with the `$store` attached
    wrapper = shallowMount(Graph, {
      localVue,
      mocks: {
        $store: store,
      },
    });
  });
  afterAll(() => {
    server.shutdown();
  });

  test('When no model data exists, the graph should say a plot has not been'
  + ' generated yet', () => {
    const node = wrapper.find('#no-graph-notification');
    expect(node.exists()).toBe(true);
    expect(node.isVisible()).toBe(true);
  });

  /**
   * Note that the render depends on there being an actual document and window
   * object to attach to to get bounding boxes and set other variables to the
   * document directly. So this only tests that the component should be visible
   * at a shallow level. It doesn't actually run the plot rendering logic.
   */
  test('When model data is provided, it renders a plot', async () => {
    expect(wrapper.vm.$store).toBeDefined();
    await wrapper.vm.$store.createModel(DEFAULT_MODEL, 'Some test model name');
    const node = wrapper.find('#d3-plot-component');
    expect(node.exists()).toBe(true);
    expect(node.isVisible()).toBe(true);
  });
});
