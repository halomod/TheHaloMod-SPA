<template>
    <md-toolbar class="md-primary" md-elevation="1">
        <md-avatar>
          <img src="../assets/thm_logo.png">
        </md-avatar>
        <h3 class="md-title" style="flex: 1">TheHaloMod</h3>
          <router-link to="/"><md-button class="md-primary">Home</md-button></router-link>
          <router-link to="/about"><md-button class="md-primary">About</md-button></router-link>
      </md-toolbar>
</template>

<script>

/**
 * Holds the primary nav bar for the application.
 */
export default {
  name: 'Navbar',
  components: {
  },
};
</script>

<style scoped>
  .md-toolbar {
    position: 'fixed';
    z-index: 9;
  }
</style>
