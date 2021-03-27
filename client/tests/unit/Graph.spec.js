import { shallowMount, createLocalVue } from '@vue/test-utils';
import Graph from '@/components/Graph';
import Vue from 'vue';
import Store from '@/utils/Store.js';
import { PLOT_AXIS_OPIONS } from '@/constants/PLOT.js';
import makeServer from '../mockServer';

// Disable dev notice info logs. Just a quality of life thing.
Vue.config.productionTip = false;
Vue.config.devtools = false;

// Setup a fake indexedDB because `window` does not exist while testing.
require('fake-indexeddb/auto');

describe('Graph tests', () => {
  let defaultModel;
  let server;
  let wrapper;
  beforeAll(async () => {
    server = makeServer('test');
    const localVue = createLocalVue();
    const store = new Store();
    await store.init();
    defaultModel = store.getFormStateFromConstants();
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
    await wrapper.vm.$store.createModel(defaultModel, 'Some test model name');
    const node = wrapper.find('#d3-chart');
    expect(node.exists()).toBe(true);
    expect(node.isVisible()).toBe(true);
  });

  test('Whenever an X axis is chosen, the correct set of Y values are set as options', async () => {
    // Set the xAxisChoice to the first choice of X Axis choices
    const { xAxisChoices } = wrapper.vm.$data;
    expect(xAxisChoices).toBeDefined();
    expect(Object.keys(xAxisChoices).length).toBeGreaterThanOrEqual(1);

    /* Loop through each x axis choice and make sure each corresponding Y axis
    option is different. */
    let previousYAxisChoice = wrapper.vm.$data.yAxisChoice;
    expect(previousYAxisChoice).toBeDefined();
    for (let i = 0; i < Object.keys(xAxisChoices).length; i += 1) {
      const xChoice = Object.keys(xAxisChoices)[i];
      wrapper.vm.$data.xAxisChoice = xChoice;
      // It seems that await has to be used here to allow the render to occur
      // eslint-disable-next-line no-await-in-loop
      await wrapper.vm.$nextTick();
      const { yAxisChoices } = wrapper.vm.$data;
      expect(yAxisChoices).toBeDefined();
      expect(yAxisChoices.length).toBeGreaterThanOrEqual(1);
      const { yAxisChoice } = wrapper.vm.$data;
      expect(yAxisChoice).toBe(PLOT_AXIS_OPIONS[xAxisChoices[xChoice]].y[0]);
      [previousYAxisChoice] = yAxisChoices;
    }
  });
});
