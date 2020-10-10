<template>
  <div class="md-layout md-gutter about">
    <span class="md-display-1 md-layout-item">TheHaloMod: The Halo Model Calculator</span>
    <md-content class="md-layout-item md-size-50">
      TheHaloMod is an app for calculating the cosmological Halo
      Model of Large Scale Structure, written by Steven Murray. It is intended
      to be used for both research and education, and I'd be very happy to hear
      how you're using it!
      The backend for this app is written in Python. If you have a working
      python installation you can install it simply with pip install halomod.
      TheHaloMod is powered by Django.

      TheHaloMod is hosted on a cluster maintained by the Low-frequency
      Cosmology (LoCo) lab at the School of Earth and Space Exploration at ASU.
      Shout-outs to Judd Bowman, Danny Jacobs, Adam Beardsley and Matt
      Kolopanis for assisting greatly with server setup and maintenance.
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
