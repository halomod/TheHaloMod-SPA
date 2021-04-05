<template>
  <div>
    <Navbar/>
    <div class="md-layout md-gutter cite">
      <h1 class="md-display-1 md-layout-item">Acknowledge</h1>

      <md-content class="md-layout-item md-size-50">
        <p>
          If you use TheHaloMod in your published research, please cite
          <a href="https://arxiv.org/abs/2009.14066">Murray et al. (2020)</a>.
          If you used TheHaloMod primarily for the halo mass functions (or
          you got here by searching for HMFcalc), please also cite
          <a href="http://arxiv.org/abs/1306.6721">Murray et al. (2013)</a>.
        </p>
        <p>
          Also, don't forget to cite the original papers of the models you
          used!
        </p>
        <p>
          One more thing. If you find TheHaloMod to be a useful tool, help us
          out by starring the
          <a
            href="https://github.com/halomod/TheHaloMod-SPA"
            target="_blank"
          >git repository</a>, and
          <a
            href="https://github.com/halomod/TheHaloMod-SPA/discussions/new?category=Show-and-tell"
            target="_blank"
          >let us know</a>
          what you're using it for! This helps to
          justify development in the future!
        </p>
      </md-content>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

/**
 * Represents the "Acknowledge" page of the website.
 */
export default {
  name: 'Acknowledge',
  components: {
    Navbar,
  },
};
</script>

<style scoped>
  .cite {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
