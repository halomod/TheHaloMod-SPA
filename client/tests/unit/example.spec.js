import { shallowMount } from '@vue/test-utils';
import SiteTitle from '../../src/components/SiteTitle.vue';

describe('SiteTitle.vue', () => {
  it('renders the title', () => {
    const title = 'TheHaloMod';
    const wrapper = shallowMount(SiteTitle);
    expect(wrapper.text()).toMatch(title);
  });
});
