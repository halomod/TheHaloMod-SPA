/* eslint-disable no-await-in-loop, no-restricted-syntax, no-continue */

import { mount, createLocalVue } from '@vue/test-utils';
import HMFForm from '@/components/forms/HMFForm';
import BACKEND_CONSTANTS from '@/constants/backend_constants';

describe('Mounted HMFForm', () => {
  const localVue = createLocalVue();
  const wrapper = mount(HMFForm, localVue);

  const options = Object.keys(BACKEND_CONSTANTS.FittingFunction_params);

  test('has correct default model', () => {
    expect(wrapper.vm.model.hmf_model).toBe('Tinker08');
  });

  test('changes model parameters when model is changed', async () => {
    for (const option of options) {
      if (wrapper.vm.model.hmf_model === option) continue;
      const oldParams = wrapper.vm.model.hmf_params;
      wrapper.vm.$data.model.hmf_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      const newParams = wrapper.vm.model.hmf_params;
      expect(JSON.stringify(oldParams)).not.toBe(JSON.stringify(newParams));
    }
  });

  test('renders correct fields for each model selection', async () => {
    for (const option of options) {
      wrapper.vm.$data.model.hmf_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      const params = Object.keys(BACKEND_CONSTANTS.FittingFunction_params[option]);
      for (const param of params) {
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${param}.*`)));
      }
    }
  });

  // leaving this in as documentation for another way to potentially do this: dynamically generates
  // narrower test cases to give you a better idea of the point of failure (thoughts?)
  //
  // test.each(options)('renders correct fields for %s model selection', async (option) => {
  //     wrapper.vm.$data.model.hmf_model = option;
  //     await localVue.nextTick();
  //     await localVue.nextTick();
  //     const params = Object.keys(BACKEND_CONSTANTS.FittingFunction_params[option]);
  //     for (const param of params) {
  //       expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${param}.*`)));
  //     }
  // })

  test('renders core parameter fields regardless of model selection', async () => {
    const coreParams = [
      'Mass Range Min',
      'Mass Range Max',
      'Mass resolution',
    ];
    for (const option of options) {
      wrapper.vm.$data.model.hmf_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      for (const param of coreParams) {
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${param}.*`)));
      }
    }
  });

  test('emits onChange event whenever model selection is changed', async () => {
    const emitted = wrapper.emitted();
    let prevCount = 0;
    for (const option of options) {
      if (wrapper.vm.model.hmf_model === option) continue;
      prevCount = emitted.onChange.length;
      wrapper.vm.$data.model.hmf_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
    }
  });

  test('emits onChange event whenever the values of model params have changed', async () => {
    const emitted = wrapper.emitted();
    let prevCount = emitted.onChange.length;
    const params = Object.keys(wrapper.vm.model.hmf_params);
    for (const param of params) {
      wrapper.vm.$data.model.hmf_params[param] += 0.01;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
    }
  });

  test('emits onChange event whenever the values of core params have changed', async () => {
    const emitted = wrapper.emitted();
    let prevCount = emitted.onChange.length;
    const coreParams = ['Mmin', 'Mmax', 'dlog10m'];
    for (const coreParam of coreParams) {
      wrapper.vm.$data.model[coreParam] += 0.01;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
    }
  });
});
