import { mount, createLocalVue } from '@vue/test-utils';
import HODForm from '@/components/HODForm';
import BACKEND_CONSTANTS from '@/constants/backend_constants';

describe('Mounted HODForm', () => {
  const localVue = createLocalVue();
  const wrapper = mount(HODForm, localVue);
  
  const options = Object.keys(BACKEND_CONSTANTS.HOD_params);

  test('has correct default model',() => {
    expect(wrapper.vm.model.hod_model).toBe('Zehavi05');
  });

  test('changes model parameters when model is changed',  async () => {
    for(let option of options){
      if(wrapper.vm.model.hod_model === option) continue;
      var oldParams = wrapper.vm.model.hod_params;
      wrapper.vm.$data.model.hod_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      var newParams = wrapper.vm.model.hod_params;
      if(option == 'Geach12'){
        expect(JSON.stringify(oldParams)).toBe(JSON.stringify(newParams));
      } else {
        expect(JSON.stringify(oldParams)).not.toBe(JSON.stringify(newParams));
      }
    };
  });

  test('renders correct fields for each model selection', async () => {
    for(let option of options){
      wrapper.vm.$data.model.hod_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      let params = Object.keys(BACKEND_CONSTANTS.HOD_params[option]);
      for(let param of params){
        expect(wrapper.html()).toEqual(expect.stringMatching(new RegExp(`.*${param}.*` )));
      }
    };
  });

  test('emits onChange event whenever model selection is changed', async () => {
    const emitted = wrapper.emitted();
    let prevCount = 0;
    for(let option of options){
      if(wrapper.vm.model.hod_model === option) continue;
      prevCount = emitted.onChange.length;
      wrapper.vm.$data.model.hod_model = option;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
    }
  });

  test('emits onChange event whenever the values of model params have changed', async () => {
    const emitted = wrapper.emitted();
    let prevCount = emitted.onChange.length;
    let params = Object.keys(wrapper.vm.model.hod_params);
    for(let param of params){
      wrapper.vm.$data.model.hod_params[param] += .01;
      await localVue.nextTick();
      await localVue.nextTick();
      expect(emitted.onChange.length).toBeGreaterThan(prevCount);
      prevCount = emitted.onChange.length;
    }
  });
})