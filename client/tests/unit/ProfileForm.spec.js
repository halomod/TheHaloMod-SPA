/* eslint-disable no-await-in-loop, no-restricted-syntax, no-continue */

import { mount, createLocalVue } from '@vue/test-utils';
import ProfileForm from '@/components/Profile';
import BACKEND_CONSTANTS from '@/constants/backend_constants';

describe('Mounted ProfileForm', () => {
  const localVue = createLocalVue();
  const wrapper = mount(
    ProfileForm,
    {
      propsData: {
        title: 'Halo Profile',
        id: 'halo-profile',
      },
      localVue,
    },
  );

  const options = Object.keys(BACKEND_CONSTANTS.Profile_params);

  test('has correct default model', () => {
    expect(wrapper.vm.model.profile_model).toBe('NFW');
  });

  test('renders correct title based on props', () => {
    const { title } = wrapper.vm.$props;
    expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${title}.*`)));
  });

  test('changes model parameters when model is changed', async () => {
    for (const option of options) {
      if (wrapper.vm.model.profile_model === option) continue;
      const oldParams = wrapper.vm.model.profile_params;
      wrapper.vm.$data.model.profile_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      const newParams = wrapper.vm.model.profile_params;
      expect(oldParams).not.toBe(newParams);
    }
  });

  test('renders correct fields for each model selection', async () => {
    for (const option of options) {
      wrapper.vm.$data.model.profile_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      const params = Object.keys(BACKEND_CONSTANTS.Profile_params[option]);
      for (const param of params) {
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${param}.*`)));
      }
    }
  });

  test('emits onChange event whenever model selection is changed', async () => {
    const emitted = wrapper.emitted();
    let prevCount = 0;
    for (const option of options) {
      if (wrapper.vm.model.profile_model === option) continue;
      prevCount = emitted.onChange.length;
      wrapper.vm.$data.model.profile_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
    }
  });
});
