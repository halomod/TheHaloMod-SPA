import { shallowMount, createLocalVue } from '@vue/test-utils';
import Download from '@/components/Download';
import Vue from 'vue';

Vue.config.productionTip = false;
Vue.config.devtools = false;

describe('Download tests', () => {
  let wrapper;
  beforeEach(() => {
    const localVue = createLocalVue();
    wrapper = shallowMount(Download, {
      localVue,
      attachTo: document.body,
      mocks: {
        $store: {},
      },
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });

  it('shows an error and clears the loading dialog when there is no plot', async () => {
    expect(document.getElementById('svg-plot')).toBeNull();
    wrapper.vm.downloadChoice = 'PlotImage';

    await expect(wrapper.vm.handleClick()).resolves.toBeUndefined();

    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.errorMessage).toMatch(/no plot to download/);
  });
});
