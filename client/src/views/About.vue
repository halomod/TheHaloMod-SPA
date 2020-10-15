<template>
  <div class="md-layout md-gutter about">
    <h1 class="md-display-1 md-layout-item">TheHaloMod
    </h1>
    <span class="md-subheading">the halo model calculator.</span>

    <md-content class="md-layout-item md-size-50">
      <p>TheHaloMod is an app for calculating the cosmological Halo
      Model of Large Scale Structure, written by Steven Murray. It is intended
      to be used for both research and education, and I'd be very happy to hear
      how you're using it!</p>
      <p>The backend for this app is written in Python. If you have a working
      python installation you can install it simply with
      <code>
        pip install halomod
      </code>.</p>

      <p>
      TheHaloMod is hosted on a cluster maintained by the
      <a href="http://loco.lab.asu.edu/">Low-frequency Cosmology</a> (LoCo)
      lab at the School of Earth and Space Exploration at ASU.
      Shout-outs to Judd Bowman, Danny Jacobs, Adam Beardsley and Matt
      Kolopanis for assisting greatly with server setup and maintenance.
      </p>
    </md-content>

  </div>
</template>

<style scoped>
  .about {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
