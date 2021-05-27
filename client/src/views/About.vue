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
        to be used for both research and education, and I'd be very
        <a
          href="https://github.com/halomod/TheHaloMod-SPA/discussions/new?category=Show-and-tell"
          target="_blank"
        >happy to hear</a>
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
        <a href="https://github.com/aschnapp">Alexander Schnapp</a>,
        <a href="https://github.com/Tengelma">Trent Engleman</a>,
        <a href="https://github.com/dblevin1">Daniel Blevins</a>, and
        <a href="https://github.com/aneuhold">Anton Neuhold</a>.</p>
      </md-content>
      <div class="md-subheading extra-info center-align">
        <span>This site is using</span>
        <md-button
          class="link-button md-accent"
          href="https://github.com/halomod/hmf"
          target="_blank"
        >
          <div class="center-align">
            <md-icon class="svg-icon" :md-src="require('../assets/github-icon.svg')" />
            <span>hmf v{{hmfVersion}}</span>
          </div>
        </md-button>
        <span>and</span>
        <md-button
          class="link-button md-accent"
          href="https://github.com/halomod/halomod"
          target="_blank"
        >
          <div class="center-align">
            <md-icon class="svg-icon" :md-src="require('../assets/github-icon.svg')" />
            <span>halomod v{{halomodVersion}}</span>
          </div>
        </md-button>
      </div>
      <span class="md-subheading extra-info">See the code for this web app
        <a target="_blank" href="https://github.com/halomod/TheHaloMod-SPA">here</a>
      </span>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import libraryVersions from '@/../generated/library_versions';

/**
 * Represents the "About" page of the website.
 */
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      hmfVersion: libraryVersions.hmf,
      halomodVersion: libraryVersions.halomod,
    };
  },
};
</script>

<style scoped>
  .about {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .extra-info {
    padding-top: 32px;
  }
  .center-align {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .svg-icon {
    margin-right: 8px;
  }
  .link-button {
    height: auto;
    /* Ignores the uppercase transform of the button */
    text-transform: none;
  }
</style>
