<template>
  <div>
    <Navbar/>
    <div class="md-layout md-gutter cite">
      <h1 class="md-display-1 md-layout-item">Acknowledgement</h1>

      <md-content class="md-layout-item md-size-50">
        <p>
          If you have found <code>TheHaloMod</code> to be a useful tool,
          please cite
          <a href="https://arxiv.org/abs/2009.14066">Murray et al. (2020)</a>.
          If you used TheHaloMod primarily for the halo mass functions
          (or you got here by searching for HMFcalc), perhaps citing
          <a href="http://arxiv.org/abs/1306.6721">Murray et al. (2013)</a>
          is more appropriate.
        </p>
      </md-content>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

/**
 * Represents the "Acknowledgement" page of the website.
 */
export default {
  name: 'Acknowledgment',
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
