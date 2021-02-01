/* eslint-disable no-await-in-loop, no-restricted-syntax, no-continue */

import { mount, createLocalVue } from '@vue/test-utils';
import HaloExclusionForm from '@/components/forms/HaloExclusionForm';
import BACKEND_CONSTANTS from '@/constants/backend_constants';

describe('Mounted HaloExclusionForm', () => {
  const localVue = createLocalVue();
  const wrapper = mount(
    HaloExclusionForm,
    localVue,
  );
  const options = Object.keys(BACKEND_CONSTANTS.Exclusion_options);

  test('has correct default model', () => {
    expect(wrapper.vm.model.exclusion_model).toBe('NoExclusion');
  });

  test('emits onChange event whenever model selection is changed', async () => {
    const emitted = wrapper.emitted();
    wrapper.vm.$emit('onChange');
    await localVue.nextTick();
    let prevCount = 0;
    for (const option of options) {
      if (wrapper.vm.model.exclusion_model === option) continue;
      prevCount = emitted.onChange.length;
      wrapper.vm.$data.model.exclusion_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
    }
  });
});
