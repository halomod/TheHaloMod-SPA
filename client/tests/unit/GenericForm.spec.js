import GenericForm from '@/components/Forms/GenericForm.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import FORMS from '@/constants/forms.js';
import VueMaterial from 'vue-material';
import clone from 'lodash.clonedeep';
import Store from '@/utils/Store';

describe('Mounted GenericForm', () => {
  const localVue = createLocalVue();
  localVue.use(VueMaterial);

  let wrapper;
  let hmModelFlat;

  beforeEach(() => {
    hmModelFlat = (new Store()).getHMModelFlatFromConstants();
    wrapper = mount(GenericForm, {
      localVue,
      propsData: {
        relevantHMModelFlat: FORMS.bias.getRelevantHMModelFlat(hmModelFlat),
        title: FORMS.bias.title,
        model_key: FORMS.bias.model_key,
        params_key: FORMS.bias.params_key,
        modelChoices: FORMS.bias.modelChoices,
        modelChoicesData: FORMS.bias.getModelChoicesDataFromFlat(hmModelFlat),
        updateModelChoice: FORMS.bias.updateModelChoice,
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
    expect(wrapper.vm.localHMModelFlat).toEqual(wrapper.vm.relevantHMModelFlat);
    expect(wrapper.vm.localModelChoicesData).toEqual(wrapper.vm.modelChoicesData);
  });

  test('correctly updates cache when model selection changes',
    async () => {
      wrapper.vm.localHMModelFlat.bias_params.B = 0.184;
      const initialState = wrapper.vm.localHMModelFlat.bias_params;
      await localVue.nextTick();
      await localVue.nextTick();
      wrapper.vm.localHMModelFlat.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      expect(wrapper.vm.localModelChoicesData.Tinker10).toEqual(initialState);
    });

  test('correctly updates available parameters when model selection changes',
    async () => {
      const initialState = wrapper.vm.localHMModelFlat.bias_params;
      wrapper.vm.localHMModelFlat.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      expect(wrapper.vm.localHMModelFlat.bias_params).not.toEqual(initialState);
    });

  test('emits onChange event whenever model selection or params changed',
    async () => {
      const emitted = wrapper.emitted();
      let prevCount = 0;
      wrapper.vm.localHMModelFlat.bias_params.B = 0.184;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
      wrapper.vm.localHMModelFlat.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
    });

  test('properly updates localHMModelFlat, defaults and cache when '
  + 'initial_state prop changes',
  async () => {
    wrapper.vm.localHMModelFlat.bias_params.B = 1;
    wrapper.vm.localHMModelFlat.bias_model = 'Tinker10PBSplit';
    await localVue.nextTick();
    await localVue.nextTick();
    const initialHMModelFlat = wrapper.vm.localHMModelFlat;
    const initialModelChoicesData = wrapper.vm.localModelChoicesData;
    wrapper.setProps({
      ...wrapper.vm.propsData,
      relevantHMModelFlat: clone(FORMS.bias.getRelevantHMModelFlat(hmModelFlat)),
    });
    await localVue.nextTick();
    await localVue.nextTick();
    expect(wrapper.vm.localHMModelFlat).not.toEqual(initialHMModelFlat);
    expect(wrapper.vm.localModelChoicesData).not.toEqual(initialModelChoicesData);
  });

  /**
   * Core UI Tests
   */

  test('renders correct number of fields when model selection changes',
    async () => {
      let fields = wrapper.findAllComponents({ name: 'DoubleField' }).wrappers;
      expect(fields).toHaveLength(Object.keys(wrapper.vm.localModelChoicesData
        .Tinker10).length);
      wrapper.vm.localHMModelFlat.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      fields = wrapper.findAllComponents({ name: 'DoubleField' });
      expect(fields).toHaveLength(Object.keys(wrapper.vm.localModelChoicesData
        .Tinker10PBSplit).length);
    });

  test('renders correct values and names for fields even when model selection changes',
    async () => {
      let params = Object.entries(wrapper.vm.localHMModelFlat.bias_params);
      params.forEach(([key, value]) => {
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${key}.*`)));
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${value}.*`)));
      });
      wrapper.vm.localHMModelFlat.bias_model = 'Tinker10PBSplit';
      await localVue.nextTick();
      await localVue.nextTick();
      params = Object.entries(wrapper.vm.localHMModelFlat.bias_params);
      params.forEach(([key, value]) => {
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
