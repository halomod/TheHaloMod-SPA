<template>
  <div id="app">
    <keep-alive include="FormView"><router-view/></keep-alive>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.$material.theming.theme = this.$store.state.theme;
  },
};
</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
