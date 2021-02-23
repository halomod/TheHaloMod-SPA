/* eslint-disable no-await-in-loop, no-restricted-syntax, no-continue */

import { mount, createLocalVue } from '@vue/test-utils';
import CosmologyForm from '@/components/forms/CosmologyForm';
import BACKEND_CONSTANTS from '@/constants/backend_constants';
import INITIAL_STATE from '@/constants/initial_state';

describe('Mounted CosmologyForm', () => {
  const localVue = createLocalVue();
  const wrapper = mount(CosmologyForm, {
    propsData: {
      title: 'Cosmology',
      init: INITIAL_STATE.cosmology,
    },
    localVue,
  });

  const options = Object.keys(BACKEND_CONSTANTS.Cosmo_params);

  test('has correct default model', async () => {
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.model.cosmo_model).toBe('Planck15');
  });

  test('changes model parameters when model is changed', async () => {
    for (const option of options) {
      if (wrapper.vm.model.cosmo_model === option) continue;
      const oldParams = JSON.stringify(wrapper.vm.model);
      wrapper.vm.$data.model.cosmo_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      const newParams = JSON.stringify(wrapper.vm.model);
      expect(oldParams).not.toBe(newParams);
    }
  });

  test('renders correct fields for each model selection', async () => {
    for (const option of options) {
      wrapper.vm.$data.model.cosmo_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      const params = Object.keys(BACKEND_CONSTANTS.Cosmo_params[option].cosmo_params);
      const htmlStrings = {
        H0: 'H<sub>0</sub>',
        Ob0: 'Ω<sub>b</sub>',
        Om0: 'Ω<sub>m</sub>',
        z: 'Redshift',
        n: 'n<sub>s</sub>',
        sigma_8: 'σ<sub>8</sub>',
      };
      for (const param of params) {
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${htmlStrings[param] || param}.*`)));
      }
    }
  });

  test('emits onChange event whenever model is changed', async () => {
    const emitted = wrapper.emitted();
    let prevCount = 0;
    for (const option of options) {
      if (wrapper.vm.model.cosmo_model === option) continue;
      prevCount = emitted.updateCosmo.length;
      wrapper.vm.$data.model.cosmo_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.updateCosmo.length).toBeGreaterThan(prevCount);
      prevCount = emitted.updateCosmo.length;
    }
  });

  test('emits onChange event whenever model subparams is changed', async () => {
    const emitted = wrapper.emitted();
    const { model } = wrapper.vm;
    let prevCount = 0;
    for (const key of Object.keys(model)) {
      if (typeof model[key] === 'number') {
        prevCount = emitted.updateCosmo.length;
        wrapper.vm.$data.model[key] += 1;
        await localVue.nextTick();
        await localVue.nextTick();
        expect(emitted.updateCosmo.length).toBeGreaterThan(prevCount);
        prevCount = emitted.updateCosmo.length;
      }
    }
  });

  test('emits onChange event whenever the values of model params have changed', async () => {
    const emitted = wrapper.emitted();
    wrapper.vm.$emit('updateCosmo');
    await localVue.nextTick();
    let prevCount = emitted.updateCosmo.length;
    const params = Object.keys(wrapper.vm.model.cosmo_params);
    for (const param of params) {
      wrapper.vm.$data.model.cosmo_params[param] += 0.1;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.updateCosmo.length).toBeGreaterThan(prevCount);
      prevCount = emitted.updateCosmo.length;
    }
  });
});
