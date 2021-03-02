import GenericForm from '@/components/forms/GenericForm.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import SUBFORMS from '@/constants/forms.js';
import INITIAL_STATE from '@/constants/initial_state.json';
import VueMaterial from 'vue-material';
import clone from 'lodash.clonedeep';

describe('Mounted GenericForm', () => {
  const localVue = createLocalVue();
  localVue.use(VueMaterial);

  let wrapper;

  beforeEach(() => {
    wrapper = mount(GenericForm, {
      localVue,
      propsData: {
        ...SUBFORMS.bias.props,
        initial_data: INITIAL_STATE.bias,
        title: SUBFORMS.bias.title,
      },
      stubs: {
        'vue-observe-visibility': true,
        'router-link': true,
        'ejs-slider': true,
      },
    });
  });

  /**
   * Core Vue Tests
   */

  test('initializes with correct data', () => {
    expect(wrapper.vm.model).toEqual(wrapper.vm.initial_data);
    expect(wrapper.vm.defaults).toEqual(wrapper.vm.initial_data);
    expect(wrapper.vm.cache).toEqual(wrapper.vm.all_data);
  });

  test('correctly updates cache when model selection changes',
    async () => {
      wrapper.vm.model.bias_params.B = 0.184;
      const initialState = wrapper.vm.model.bias_params;
      await localVue.nextTick();
      await localVue.nextTick();
      wrapper.vm.model.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      expect(wrapper.vm.cache.Tinker10).toEqual(initialState);
    });

  test('correctly updates available parameters when model selection changes',
    async () => {
      const initialState = wrapper.vm.model.bias_params;
      wrapper.vm.model.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      expect(wrapper.vm.model.bias_params).not.toEqual(initialState);
    });

  test('emits onChange event whenever model selection or params changed',
    async () => {
      const emitted = wrapper.emitted();
      let prevCount = 0;
      wrapper.vm.model.bias_params.B = 0.184;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
      wrapper.vm.model.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
    });

  test('properly updates model, defaults and cache when initial_state prop changes',
    async () => {
      wrapper.vm.model.bias_params.B = 1;
      wrapper.vm.model.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      const initialModel = wrapper.vm.model;
      const initialDefaults = wrapper.vm.defaults;
      const initialCache = wrapper.vm.cache;
      wrapper.setProps({
        ...wrapper.vm.propsData,
        initial_data: clone(INITIAL_STATE.bias),
      });
      await localVue.nextTick();
      await localVue.nextTick();
      expect(wrapper.vm.model).not.toEqual(initialModel);
      expect(wrapper.vm.defaults).not.toEqual(initialDefaults);
      expect(wrapper.vm.cache).not.toEqual(initialCache);
    });

  /**
   * Core UI Tests
   */

  test('renders correct number of fields when model selection changes',
    async () => {
      let fields = wrapper.findAllComponents({ name: 'DoubleField' });
      expect(fields).toHaveLength(Object.keys(wrapper.vm.cache.Tinker10).length);
      wrapper.vm.model.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      fields = wrapper.findAllComponents({ name: 'DoubleField' });
      expect(fields).toHaveLength(Object.keys(wrapper.vm.cache.Tinker10PBSplit).length);
    });

  test('renders correct values and names for fields even when model selection changes',
    async () => {
      let params = Object.entries(wrapper.vm.model.bias_params);
      params.forEach(([key, value], _) => {
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${key}.*`)));
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${value}.*`)));
      });
      wrapper.vm.model.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      params = Object.entries(wrapper.vm.model.bias_params);
      params.forEach(([key, value], _) => {
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${key}.*`)));
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${value}.*`)));
      });
    });

  test('renders correct title based on props',
    async () => {
      expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp('.*Bias.*')));
      wrapper.setProps({
        ...wrapper.vm.propsData,
        title: 'Another Model',
      });
      await localVue.nextTick();
      await localVue.nextTick();
      expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp('.*Another Model.*')));
    });
});
