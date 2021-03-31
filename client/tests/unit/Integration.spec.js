import { mount, createLocalVue } from '@vue/test-utils';
import FormView from '@/views/Forms.vue';
import Forms from '@/components/Forms';
import FORMS from '@/constants/forms';
import GenericForm from '@/components/Forms/GenericForm';
import Store from '@/utils/Store';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import makeServer from '../mockServer';

const $route = {
  path: '/create',
  name: 'Create',
  hash: '',
  params: null,
  query: null,
};

const subFormOptions = {
  cosmo: 'WMAP5',
  mdef: 'SOCritical',
  transfer: 'BondEfs',
  filter: 'SharpK',
  growth: 'GenMFGrowth',
  hmf: 'Reed07',
  halo_model: 'filtered_lin',
  hod: 'Contreras13',
  bias: 'Seljack04Cosmo',
  halo_concentration: 'Zehavi11',
  tracer_concentration: 'Zehavi11',
  halo_profile: 'Einasto',
  tracer_profile: 'Einasto',
  halo_exclusion: 'DblSphere',
};

// Disable dev notice info logs. Just a quality of life thing.
Vue.config.productionTip = false;
Vue.config.devtools = false;

// Setup a fake indexedDB because `window` does not exist while testing.
require('fake-indexeddb/auto');

describe('Mounted FormView', () => {
  const localVue = createLocalVue();
  localVue.use(VueMaterial);

  let wrapper;
  let server;
  let genericForms;

  beforeAll(async () => {
    server = makeServer('test');
    const store = new Store();
    await store.init();
    if (typeof store.state !== 'object') {
      throw new Error('Store wasn\'t initialized correctly in test. The store is'
      + ` ${JSON.stringify(store)}`);
    }
    wrapper = mount(FormView, {
      localVue,
      mocks: {
        $route,
        $store: store,
      },
      stubs: {
        'vue-observe-visibility': true,
        'router-link': true,
        'ejs-slider': true,
      },
    });
    wrapper.vm.$options.activated[0].call(wrapper.vm);
    await wrapper.vm.$nextTick();
  });
  afterAll(() => {
    server.shutdown();
  });

  test('renders top level view FormView component', () => {
    expect(wrapper.findComponent(FormView).exists()).toBe(true);
  });

  test('renders composite Forms component', () => {
    expect(wrapper.findComponent(Forms).exists()).toBe(true);
  });

  test('renders all subforms',
    () => {
      genericForms = wrapper.findAllComponents(GenericForm).wrappers;
      const formsLength = Object.keys(FORMS).length;
      expect(genericForms.length).toBe(formsLength);
    });

  describe('subform tests', () => {
    test('updates composite form state whenever subform state changes', async () => {
      await genericForms.forEach(async (genericForm) => {

        const subformMeta = genericForm.vm.subformMeta;
        expect(subformMeta).toBeDefined();

        const newOption = subFormOptions[subformMeta.id];
        const originalState = wrapper.vm.currentFormState;
        const modelKey = subformMeta.title === FORMS.halo_model.title
          ? 'hc_spectrum'
          : subformMeta.modelKey;

        genericForm.vm.subformState[modelKey] = newOption;
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.currentFormState).not.toBe(originalState);
      });
    });

    test('does not update subform state when composite form state changes', async () => {
      await genericForms.forEach(async (genericForm) => {
        const subformMeta = genericForm.vm.subformMeta;
        const newOption = subFormOptions[subformMeta.id];
        const modelKey = subformMeta.title === FORMS.halo_model.title
          ? 'hc_spectrum'
          : subformMeta.modelKey;
        const originalState = genericForm.vm.subformState[modelKey];
        wrapper.vm.currentFormState[modelKey] = newOption;
        await wrapper.vm.$nextTick();
        expect(genericForm.vm.subformState[modelKey]).toBe(originalState);
      });
    });
  });
});
