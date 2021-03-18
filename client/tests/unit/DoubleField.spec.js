import { mount, createLocalVue } from '@vue/test-utils';
import DoubleField from '@/components/DoubleField.vue';

describe('Mounted DoubleField', () => {
  let wrapper;
  let localVue;
  const propsData = {
    init: 7,
    range: true,
    min: 5,
    max: 10,
    param: 'field_name',
    html: '<b>field_html<b>',
  };

  beforeEach(() => {
    localVue = createLocalVue();
    wrapper = mount(DoubleField, {
      localVue,
      propsData,
    });
  });

  test('initializes with correct value', () => {
    expect(wrapper.vm.current).toEqual(wrapper.vm.init);
  });

  test('displays no errors when current is valid', () => {
    expect(wrapper.html()).toEqual(expect.not.stringContaining('Value must be defined'));
    expect(wrapper.html()).toEqual(expect.not.stringContaining('Value must be numeric'));
    expect(wrapper.html()).toEqual(expect.not.stringContaining('Value must be between 5 and 10'));
  });

  test('displays \'not defined\' error if current is not defined', async () => {
    wrapper.vm.current = '';
    await localVue.nextTick();
    expect(wrapper.html()).toEqual(expect.stringContaining('Value must be defined'));
  });

  test('displays \'not numeric\' error if current is not numeric', async () => {
    wrapper.vm.current = '0.0.0';
    await localVue.nextTick();
    expect(wrapper.html()).toEqual(expect.stringContaining('Value must be numeric'));
  });

  test('displays \'not between\' error if current is not in range', async () => {
    wrapper.vm.current = 12;
    await localVue.nextTick();
    expect(wrapper.html()).toEqual(expect.stringContaining('Value must be between 5 and 10'));
  });

  test('updates current when init changes', async () => {
    await wrapper.setProps({ ...propsData, init: 12 });
    await localVue.nextTick();
    expect(wrapper.vm.current).toEqual(wrapper.vm.init);
  });

  test('emits current value on valid change', async () => {
    wrapper.vm.current = 6;
    await localVue.nextTick();
    expect(wrapper.emitted('input')[0]).toEqual([6]);
  });

  test('displays the field name as text if html prop is undefined', async () => {
    await wrapper.setProps({ ...propsData, html: undefined });
    await localVue.nextTick();
    expect(wrapper.html()).toEqual(expect.stringContaining(wrapper.vm.param));
  });

  test('displays the field name as html if html prop is defined', async () => {
    expect(wrapper.html()).toEqual(expect.not.stringContaining(wrapper.vm.param));
    expect(wrapper.html()).toEqual(expect.stringContaining(wrapper.vm.html));
  });
});
