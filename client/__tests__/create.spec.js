import { shallowMount, createLocalVue } from '@vue/test-utils';
import Create from '@/views/Create.vue';
import Concentration from '@/components/Concentration.vue';
import HaloExclusion from '@/components/HaloExclusion.vue';
import BiasForm from '@/components/BiasForm.vue';
import HMFForm from '@/components/HMFForm.vue';
import HODForm from '@/components/HODForm.vue';
import Profile from '@/components/Profile.vue';
import ModelMetadataForm from '@/components/ModelMetadataForm.vue';
import CosmologyForm from '@/components/CosmologyForm.vue';
import MassDefinitionForm from '@/components/MassDefinitionForm.vue';
import GrowthForm from '@/components/GrowthForm.vue';
import HaloModelForm from '@/components/HaloModelForm.vue';
import FilterForm from '@/components/FilterForm.vue';
import TransferForm from '@/components/TransferForm.vue';
import constants from '@/constants/initial_state.json';
import VueMaterial from 'vue-material';
import VueObserveVisibility from 'vue-observe-visibility';

describe('Mounted Create', () => {
  // creates a Vue instance locally so plugins can be used; required to import
  // plugins in use from libraries and avoid warnings
  const localVue = createLocalVue();
  localVue.use(VueMaterial);
  localVue.use(VueObserveVisibility);

  // shallowMount only renders top level component and uses stubs for everything
  // below 
  const wrapper = shallowMount(Create /* the component you're trying to test */, {
    localVue, // a reference to the Vue instance from above
    propsData: { // any props that need to be passed to the component for it to function / avoid warnings
      model_metadata: {},
      params: constants,
    }
  });

  test('has all forms', () => {
    expect(wrapper.findComponent(BiasForm)).toBeTruthy(); //checks if BiasForm is present in the rendered page
    expect(wrapper.findComponent(Concentration)).toBeTruthy(); // same for the rest of these expect() calls and their respective forms
    expect(wrapper.findComponent(CosmologyForm)).toBeTruthy();
    expect(wrapper.findComponent(FilterForm)).toBeTruthy();
    expect(wrapper.findComponent(GrowthForm)).toBeTruthy();
    expect(wrapper.findComponent(HaloExclusion)).toBeTruthy();
    expect(wrapper.findComponent(HaloModelForm)).toBeTruthy();
    expect(wrapper.findComponent(Profile)).toBeTruthy();
    expect(wrapper.findComponent(HMFForm)).toBeTruthy();
    expect(wrapper.findComponent(HODForm)).toBeTruthy();
    expect(wrapper.findComponent(MassDefinitionForm)).toBeTruthy();
    expect(wrapper.findComponent(ModelMetadataForm)).toBeTruthy();
    expect(wrapper.findComponent(TransferForm)).toBeTruthy();
  })
})