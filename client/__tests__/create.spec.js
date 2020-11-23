import { mount } from '@vue/test-utils';
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

describe('Mounted Create', () => {
  const wrapper = mount(Create);

  test('has all forms', () => {
    expect(wrapper.findComponent(BiasForm)).toBeTruthy();
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
    expect(wrapper.findComponent(ModelMetadataForm)).toBeTruthy();
    expect(wrapper.findComponent(TransferForm)).toBeTruthy();
  })
})