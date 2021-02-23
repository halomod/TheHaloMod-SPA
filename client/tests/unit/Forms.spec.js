import { shallowMount, createLocalVue } from '@vue/test-utils';
import Forms from '@/views/Forms.vue';
import Concentration from '@/components/forms/ConcentrationForm.vue';
import HaloExclusion from '@/components/forms/HaloExclusionForm.vue';
import BiasForm from '@/components/forms/BiasForm.vue';
import HMFForm from '@/components/forms/HMFForm.vue';
import HODForm from '@/components/forms/HODForm.vue';
import Profile from '@/components/forms/ProfileForm.vue';
import CosmologyForm from '@/components/forms/CosmologyForm.vue';
import MassDefinitionForm from '@/components/forms/MassDefinitionForm.vue';
import GrowthForm from '@/components/forms/GrowthForm.vue';
import HaloModelForm from '@/components/forms/HaloModelForm.vue';
import FilterForm from '@/components/forms/FilterForm.vue';
import TransferForm from '@/components/forms/TransferForm.vue';
import constants from '@/constants/initial_state.json';
import VueMaterial from 'vue-material';
import VueObserveVisibility from 'vue-observe-visibility';

describe('Mounted Forms', () => {
  // creates a Vue instance locally so plugins can be used; required to import
  // plugins in use from libraries and avoid warnings
  const localVue = createLocalVue();
  localVue.use(VueMaterial);
  localVue.use(VueObserveVisibility);

  // shallowMount only renders top level component and uses stubs for everything
  // below
  const wrapper = shallowMount(Forms /* the component you're trying to test */, {
    localVue, // a reference to the Vue instance from above
    // any props that need to be passed to the component for it to function / avoid warnings
    propsData: {
      modelName: 'Model',
      params: constants,
    },
  });

  test('has all forms', () => {
    // checks if BiasForm is present in the rendered page
    expect(wrapper.findComponent(BiasForm)).toBeTruthy();
    // same for the rest of these expect() calls and their respective forms
    expect(wrapper.findComponent(Concentration)).toBeTruthy();
    expect(wrapper.findComponent(CosmologyForm)).toBeTruthy();
    expect(wrapper.findComponent(FilterForm)).toBeTruthy();
    expect(wrapper.findComponent(GrowthForm)).toBeTruthy();
    expect(wrapper.findComponent(HaloExclusion)).toBeTruthy();
    expect(wrapper.findComponent(HaloModelForm)).toBeTruthy();
    expect(wrapper.findComponent(Profile)).toBeTruthy();
    expect(wrapper.findComponent(HMFForm)).toBeTruthy();
    expect(wrapper.findComponent(HODForm)).toBeTruthy();
    expect(wrapper.findComponent(MassDefinitionForm)).toBeTruthy();
    expect(wrapper.findComponent(TransferForm)).toBeTruthy();
  });
});
