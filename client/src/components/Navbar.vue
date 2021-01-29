<template>
  <md-toolbar class="md-primary" md-elevation="1">
    <md-avatar>
      <img src="../assets/thm_logo.png">
    </md-avatar>
    <h3 class="md-title" style="flex: 1">The Halo Mod</h3>
    <md-button v-for="{route, name, click, props} in buttons"
      :key="name"
      :to="route"
      @click="click"
      class="md-primary"
      v-bind="props"
    >
      {{name}}
    </md-button>
  </md-toolbar>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    buttons: {
      type: Array,
      default: () => [{
        route: '/',
        name: 'Home',
        click: () => null,
      }, {
        route: '/about',
        name: 'About',
        click: () => null,
      }],
    },
  },
};
</script>
