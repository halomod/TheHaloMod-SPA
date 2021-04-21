import GenericForm from '@/components/Forms/GenericForm.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import VueMaterial from 'vue-material';
import clone from 'lodash.clonedeep';
import { DEFAULT_FORM_STATE, FORM_OPTION_DEFAULTS } from '@/constants/backend_constants.js';
import { getHtmlFromKey } from '@/utils/stringUtils';

describe('Mounted GenericForm', () => {
  const localVue = createLocalVue();
  localVue.use(VueMaterial);

  let wrapper;
  let currentFormState;

  beforeEach(() => {
    currentFormState = clone(DEFAULT_FORM_STATE);
    wrapper = mount(GenericForm, {
      localVue,
      propsData: {
        initialSubformState: currentFormState.bias,
        formId: 'bias',
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
    expect(wrapper.vm.subformState).toEqual(wrapper.vm.initialSubformState);
    expect(wrapper.vm.cachedSubformInputs).toEqual(FORM_OPTION_DEFAULTS.bias);
  });

  test('correctly updates cache when model selection changes',
    async () => {
      wrapper.vm.subformState.bias_params.B = 0.184;
      const initialState = wrapper.vm.subformState.bias_params;
      await localVue.nextTick();
      await localVue.nextTick();
      wrapper.vm.subformState.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      expect(wrapper.vm.cachedSubformInputs.Tinker10).toEqual(initialState);
    });

  test('correctly updates available parameters when model selection changes',
    async () => {
      const initialState = wrapper.vm.subformState.bias_params;
      wrapper.vm.subformState.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      expect(wrapper.vm.subformState.bias_params).not.toEqual(initialState);
    });

  test('emits onChange event whenever model selection or params changed',
    async () => {
      const emitted = wrapper.emitted();
      let prevCount = 0;
      wrapper.vm.subformState.bias_params.B = 0.184;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
      wrapper.vm.subformState.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
    });

  test('properly updates subformState, defaults and cache when '
  + 'initialSubformState prop changes',
  async () => {
    wrapper.vm.subformState.bias_params.B = 1;
    wrapper.vm.subformState.bias_model = 'Tinker10PBSplit';
    await localVue.nextTick();
    await localVue.nextTick();
    const currentSubformState = wrapper.vm.subformState;
    const currentCache = wrapper.vm.cachedSubformInputs;
    wrapper.setProps({
      ...wrapper.vm.propsData,
      initialSubformState: clone(DEFAULT_FORM_STATE.bias),
    });
    await localVue.nextTick();
    await localVue.nextTick();
    expect(wrapper.vm.subformState).not.toEqual(currentSubformState);
    expect(wrapper.vm.cachedSubformInputs).not.toEqual(currentCache);
  });

  /**
   * Core UI Tests
   */

  test('renders correct number of fields when model selection changes',
    async () => {
      let fields = wrapper.findAllComponents({ name: 'DoubleField' }).wrappers;
      expect(fields).toHaveLength(Object.keys(wrapper.vm.cachedSubformInputs
        .Tinker10).length);
      wrapper.vm.subformState.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      fields = wrapper.findAllComponents({ name: 'DoubleField' });
      expect(fields).toHaveLength(Object.keys(wrapper.vm.cachedSubformInputs
        .Tinker10PBSplit).length);
    });

  test('renders correct values and names for fields even when model selection changes',
    async () => {
      let params = Object.entries(wrapper.vm.subformState.bias_params);
      params.forEach(([key, value]) => {
        // Just in case the key is automatically converted to a different style
        const htmlKeyResult = getHtmlFromKey(key);
        let matchKey = key;
        if (htmlKeyResult) {
          matchKey = htmlKeyResult;
        }
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${matchKey}.*`)));
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${value}.*`)));
      });
      wrapper.vm.subformState.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      params = Object.entries(wrapper.vm.subformState.bias_params);
      params.forEach(([key, value]) => {
        // Just in case the key is automatically converted to a different style
        const htmlKeyResult = getHtmlFromKey(key);
        let matchKey = key;
        if (htmlKeyResult) {
          matchKey = htmlKeyResult;
        }
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${matchKey}.*`)));
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${value}.*`)));
      });
    });

  test('renders correct title based on props',
    async () => {
      expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp('.*Bias.*')));
      wrapper.vm.subformMeta.title = 'New Form';
      await localVue.nextTick();
      await localVue.nextTick();
      expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp('.*New Form.*')));
    });
});
