import { mount } from '@vue/test-utils';
import FormView from '@/views/Forms.vue';
import Forms from '@/components/forms';
import BiasForm from '@/components/forms/BiasForm.vue'
import ConcentrationForm from '@/components/forms/ConcentrationForm.vue';
import HaloExclusion from '@/components/forms/HaloExclusionForm.vue';
import HMFForm from '@/components/forms/HMFForm.vue';
import HODForm from '@/components/forms/HODForm.vue';
import ProfileForm from '@/components/forms/ProfileForm.vue';
import CosmologyForm from '@/components/forms/CosmologyForm.vue';
import MassDefinitionForm from '@/components/forms/MassDefinitionForm.vue';
import GrowthForm from '@/components/forms/GrowthForm.vue';
import HaloModelForm from '@/components/forms/HaloModelForm.vue';
import FilterForm from '@/components/forms/FilterForm.vue';
import TransferForm from '@/components/forms/TransferForm.vue';

const $route = {
  path: '/create',
  hash: '',
  params: null,
  query: null,
};

const subforms = {
  BiasForm,
  ConcentrationForm,
  HaloExclusion,
  HMFForm,
  HODForm,
  ProfileForm,
  MassDefinitionForm,
  GrowthForm,
  HaloModelForm,
  FilterForm,
  TransferForm,
  CosmologyForm,
};

describe ('Mounted FormView', () => {
  let wrapper;

  beforeAll( async () => {
    wrapper = mount(FormView);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
  });

  test('contains FormView', () => {
    expect(wrapper.findComponent(FormView).exists()).toBe(true);
  });

  test('renders composite form', () => {
    expect(wrapper.findComponent(FormView).exists()).toBe(true);
    expect(wrapper.findComponent(FormView).findComponent(Forms).exists()).toBe(true);
  });

  test.each(Object.entries(subforms))
    ('renders %s subform.', 
    async (_, component) => {
      expect(wrapper.findComponent(component).exists()).toBe(true);
    }
  );

  test.each(Object.entries(subforms))
    ('updates composite form state whenever %s subform state changes', 
    (_, component) => {
      const originalState = wrapper.vm.current;
      const subform = wrapper.findComponent(component);
      const keys = Object.keys(subform.vm.model);
      const modelKey = keys.filter(key => key.includes('model'))[0];
      subform.vm.model[modelKey] = 'New Option';
      expect(wrapper.vm.current).not.toBe(originalState);
    }
  );

  test.each(Object.entries(subforms))
    ('does not update %s subform state when composite form state changes', 
    (_, component) => {
      const subform = wrapper.findComponent(component);
      const subformId = subform.vm.id;
      const keys = Object.keys(subform.vm.model);
      const modelKey = keys.filter(key => key.includes('model'))[0];
      const originalState = subform.vm.model[modelKey];
      wrapper.vm.current[modelKey] = 'New Option';
      expect(subform.vm.model[subformId][modelKey].toBe(originalState));
    })
});
