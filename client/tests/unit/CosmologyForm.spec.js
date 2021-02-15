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
      const oldParams = wrapper.vm.model.cosmo_params;
      wrapper.vm.$data.model.cosmo_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      const newParams = wrapper.vm.model.cosmo_params;
      expect(oldParams).not.toBe(newParams);
    }
  });

  test('renders correct fields for each model selection', async () => {
    for (const option of options) {
      wrapper.vm.$data.model.cosmo_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      const params = Object.keys(BACKEND_CONSTANTS.Cosmo_params[option].cosmo_params);
      for (const param of params) {
        switch (param) {
          case 'H0':
            expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp('.*H<sub>0</sub>.*')));
            break;
          case 'Ob0':
            expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp('.*Ω<sub>b</sub>.*')));
            break;
          case 'Om0':
            expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp('.*Ω<sub>m</sub>.*')));
            break;
          case 'z':
            expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp('.*Redshift.*')));
            break;
          case 'n':
            expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp('.*n<sub>s</sub>.*')));
            break;
          case 'sigma_8':
            expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp('.*σ<sub>8</sub>.*')));
            break;
          default:
            expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${param}.*`)));
            break;
        }
      }
    }
  });

  test('emits onChange event whenever model selection is changed', async () => {
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

  test('emits onChange event whenever the values of model params have changed', async () => {
    const emitted = wrapper.emitted();
    wrapper.vm.$emit('updateCosmo');
    await localVue.nextTick();
    let prevCount = emitted.updateCosmo.length;
    const params = Object.keys(wrapper.vm.model.cosmo_params);
    for (const param of params) {
      const val = wrapper.vm.$data.model.cosmo_params[param];
      if (typeof val === 'string') {
        if (val === 'full') {
          wrapper.vm.$data.model.cosmo_params[param] = 'relaxed';
        } else {
          wrapper.vm.$data.model.cosmo_params[param] = 'full';
        }
      } else {
        wrapper.vm.$data.model.cosmo_params[param] += 0.1;
      }
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.updateCosmo.length).toBeGreaterThan(prevCount);
      prevCount = emitted.updateCosmo.length;
    }
  });
});
