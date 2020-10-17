import { shallowMount } from '@vue/test-utils';
import About from '../../src/views/About.vue';

describe('About.vue', () => {
  it('renders the title', () => {
    const titleText = 'TheHaloMod';
    const wrapper = shallowMount(About);
    const title = wrapper.find('h1');
    expect(title.text()).toBe(titleText);
  });
});
