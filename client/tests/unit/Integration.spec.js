import { mount, createLocalVue } from '@vue/test-utils';
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
import VueMaterial from 'vue-material';

const $route = {
  path: '/create',
  name: 'Create',
  hash: '',
  params: null,
  query: null,
};

const subforms = [
  ["BiasForm", BiasForm, "Seljack04Cosmo"],
  ["ConcentrationForm", ConcentrationForm, "Zehavi11"],
  ["HaloExclusionForm", HaloExclusion, "DblSphere"],
  ["HMFForm", HMFForm, "Reed07"],
  ["HODForm", HODForm, "Contreras13"],
  ["ProfileForm", ProfileForm, "Einasto"],
  ["MassDefinitionForm", MassDefinitionForm, "SOCritical"],
  ["GrowthForm", GrowthForm, "GenMFGrowth"],
  ["HaloModelForm", HaloModelForm, "filtered_lin"],
  ["FilterForm", FilterForm, "SharpK"],
  ["TransferForm", TransferForm, "BondEfs"],
  ["CosmologyForm", CosmologyForm, "WMAP5"],
];

describe ('Mounted FormView', () => {
  const localVue = createLocalVue();
  localVue.use(VueMaterial);

  let wrapper;

  beforeAll( async () => {
    wrapper = mount(FormView, {
      localVue,
      mocks: {
        $route,
      },
      stubs: {
        'vue-observe-visibility': true,
        'router-link': true,
        'ejs-slider': true,
      },
    });
    wrapper.vm.$options.activated[0].call(wrapper.vm);
    await wrapper.vm.$nextTick();
  });

  test('contains FormView', () => {
    expect(wrapper.findComponent(FormView).exists()).toBe(true);
  });

  test('renders composite form', () => {
    expect(wrapper.findComponent(Forms).exists()).toBe(true);
  });

  test.each(subforms)
    ('renders %s subform.', 
    async (_, component) => {
      expect(wrapper.findComponent(component).exists()).toBe(true);
    }
  );

  test.each(subforms)
    ('updates composite form state whenever %s subform state changes', 
    async (_, component, newOption) => {
      const originalState = wrapper.vm.current;
      const subform = wrapper.findComponent(component);
      const keys = Object.keys(subform.vm.model);
      const modelKey = component === HaloModelForm
        ? 'hc_spectrum'
        : keys.filter(key => key.includes('model'))[0];
      subform.vm.model[modelKey] = newOption;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.current).not.toBe(originalState);
    }
  );

  test.each(subforms)
    ('does not update %s subform state when composite form state changes', 
    async (_, component, newOption) => {
      const subform = wrapper.findComponent(component);
      const subformId = subform.vm.subform_id;
      const keys = Object.keys(subform.vm.model);
      const modelKey = component === HaloModelForm
        ? 'hc_spectrum'
        : keys.filter(key => key.includes('model'))[0];
      const originalState = subform.vm.model[modelKey];
      wrapper.vm.current[subformId][modelKey] = newOption;
      await wrapper.vm.$nextTick();
      expect(subform.vm.model[modelKey]).toBe(originalState);
    })
});
