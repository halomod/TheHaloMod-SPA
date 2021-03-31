<template>
    <md-toolbar class="md-primary" md-elevation="1">
        <router-link to="/">
          <md-button class="title-button">
            <div class="clickable-title">
              <md-avatar>
                <img class="logo" src="../assets/thm_logo.png">
              </md-avatar>
              <h1 class="md-title">TheHaloMod</h1>
            </div>
          </md-button>
        </router-link>

        <div>
          <router-link to="/about"><md-button class="md-primary">About</md-button></router-link>
        </div>
      </md-toolbar>
</template>

<script>

/**
 * Holds the primary nav bar for the application.
 */
export default {
  name: 'Navbar',
};
</script>

<style scoped>
  .title-button {
    height: auto;
    /* Ignores the uppercase transform of the button */
    text-transform: none;
  }
  .logo {
    margin: 0;
  }
  .clickable-title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .md-toolbar {
    position: 'fixed';
    z-index: 9;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
