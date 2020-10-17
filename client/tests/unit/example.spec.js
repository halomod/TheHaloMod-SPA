import { shallowMount } from '@vue/test-utils';
import Navbar from '../../src/views/Navbar.vue';
import About from '../../src/views/About.vue';

describe('Navbar', () => {
  it('renders a md-toolbar', () => {
    const wrapper = shallowMount(Navbar);
    expect(wrapper.contains('md-toolbar')).toBe(true);
  });
});

describe('About.vue', () => {
  it('renders the title', () => {
    const titleText = 'TheHaloMod';
    const wrapper = shallowMount(About);
    const title = wrapper.find('h1');
    expect(title.text()).toBe(titleText);
  });
});
