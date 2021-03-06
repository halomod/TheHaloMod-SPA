<template>
  <div>
    <Navbar/>
    <div class="md-layout md-gutter about">
      <h1 class="md-display-1 md-layout-item">TheHaloMod
      </h1>

      <md-content class="md-layout-item md-size-50">
        <p>TheHaloMod is an app for calculating the cosmological Halo
        Model of Large Scale Structure, written by
        <a href="http://loco.lab.asu.edu/steven-murray/">Steven Murray</a>.
        It is intended
        to be used for both research and education, and I'd be very happy to hear
        how you're using it!</p>

        <p>The backend for this app is written in Python. If you have a working
        python installation you can install it simply with
        <code>pip install halomod</code>.</p>

        <p>TheHaloMod is hosted on a cluster maintained by the
        <a href="http://loco.lab.asu.edu/">Low-frequency Cosmology</a> (LoCo)
        lab at the <a href="http://sese.asu.edu%20target%3D/">School of Earth
        and Space Exploration</a> at ASU. </p>

        <p>Shout-outs to Judd Bowman, Danny Jacobs, Adam Beardsley and Matt
        Kolopanis for assisting greatly with server
        setup and maintenance. Also shoutout to the ASU students who helped
        build this version of the website:
        <a href="https://github.com/vperuzzi">Tia Peruzzi</a>,
        <a href="https://github.com/aschnapp">Michael Schnapp</a>,
        <a href="https://github.com/Tengelma">Trent Engleman</a>,
        <a href="https://github.com/dblevin1">Daniel Blevins</a>, and
        <a href="https://github.com/aneuhold">Anton Neuhold</a>.</p>
      </md-content>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

/**
 * Represents the "About" page of the website.
 */
export default {
  components: {
    Navbar,
  },
};
</script>

<style scoped>
  .about {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
