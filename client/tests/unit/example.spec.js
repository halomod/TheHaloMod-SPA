import { shallowMount } from '@vue/test-utils';
import Navbar from '../../src/views/Navbar.vue';

describe('Navbar', () => {
  it('renders a md-toolbar', () => {
    const wrapper = shallowMount(Navbar);
    expect(wrapper.contains('md-toolbar')).toBe(true);
  });
});
