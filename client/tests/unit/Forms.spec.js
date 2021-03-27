import { shallowMount, createLocalVue } from '@vue/test-utils';
import Forms from '@/components/Forms';
import GenericForm from '@/components/Forms/GenericForm';
import FORMS from '@/constants/forms.js';
import Store from '@/utils/Store';
import VueMaterial from 'vue-material';
import VueObserveVisibility from 'vue-observe-visibility';

// Setup a fake indexedDB because `window` does not exist while testing.
require('fake-indexeddb/auto');

describe('Mounted Forms', () => {
  // creates a Vue instance locally so plugins can be used; required to import
  // plugins in use from libraries and avoid warnings
  let localVue = createLocalVue();
  localVue.use(VueMaterial);
  localVue.use(VueObserveVisibility);

  let wrapper;
  beforeAll(async () => {
    localVue = createLocalVue();
    const store = new Store();
    const currentFormState = store.getFormStateFromConstants();
    // Mount the component with the `$store` attached
    wrapper = shallowMount(Forms, {
      localVue,
      propsData: {
        initialFormState: currentFormState,
        contextPrimary: 'Create',
        contextSecondary: 'New Model',
      },
    });
  });

  test('has all forms', () => {
    const forms = wrapper.findAllComponents(GenericForm);
    const formsCount = Object.keys(FORMS).length;
    expect(forms.length).toEqual(formsCount);
  });
});
