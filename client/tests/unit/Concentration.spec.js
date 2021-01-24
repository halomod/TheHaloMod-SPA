/* eslint-disable no-await-in-loop, no-restricted-syntax, no-continue */

import { mount, createLocalVue } from '@vue/test-utils';
import ConcentrationForm from '@/components/Concentration';
import BACKEND_CONSTANTS from '@/constants/backend_constants';

describe('Mounted ConcentrationForm', () => {
  const localVue = createLocalVue();
  const wrapper = mount(
    ConcentrationForm,
    {
      propsData: {
        title: 'Tracer Concentration',
        id: 'tracer-concentration',
        defaultModel: 'Bullock01',
      },
      localVue,
    },
  );

  const options = Object.keys(BACKEND_CONSTANTS.CMRelation_params);

  test('has correct default model', () => {
    expect(wrapper.vm.model.concentration_model).toBe('Bullock01');
  });

  test('renders correct title based on props', () => {
    const { title } = wrapper.vm.$props;
    expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${title}.*`)));
  });

  test('changes model parameters when model is changed', async () => {
    for (const option of options) {
      if (wrapper.vm.model.concentration_model === option) continue;
      const oldParams = wrapper.vm.model.concentration_params;
      wrapper.vm.$data.model.concentration_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      const newParams = wrapper.vm.model.concentration_params;
      expect(oldParams).not.toBe(newParams);
    }
  });

  test('renders correct fields for each model selection', async () => {
    for (const option of options) {
      wrapper.vm.$data.model.concentration_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      const params = Object.keys(BACKEND_CONSTANTS.CMRelation_params[option]);
      for (const param of params) {
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${param}.*`)));
      }
    }
  });

  test('emits onChange event whenever model selection is changed', async () => {
    const emitted = wrapper.emitted();
    let prevCount = 0;
    for (const option of options) {
      if (wrapper.vm.model.concentration_model === option) continue;
      prevCount = emitted.onChange.length;
      wrapper.vm.$data.model.concentration_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
    }
  });

  test('emits onChange event whenever the values of model params have changed', async () => {
    const emitted = wrapper.emitted();
    wrapper.vm.$emit('onChange');
    await localVue.nextTick();
    let prevCount = emitted.onChange.length;
    const params = Object.keys(wrapper.vm.model.concentration_params);
    for (const param of params) {
      const val = wrapper.vm.$data.model.concentration_params[param];
      if (typeof val === 'string') {
        if (val === 'full') {
          wrapper.vm.$data.model.concentration_params[param] = 'relaxed';
        } else {
          wrapper.vm.$data.model.concentration_params[param] = 'full';
        }
      } else {
        wrapper.vm.$data.model.concentration_params[param] += 0.1;
      }
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
    }
  });
});
