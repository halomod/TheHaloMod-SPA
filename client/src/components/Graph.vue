<template>
  <div>
    <md-toolbar class="md-large">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <h3 class="md-title">Plot</h3>
        </div>
      </div>
      <img v-if="READ_ONLY.plot !== null" :src="READ_ONLY.plot"/>
      <p v-else>No graph has been generated yet</p>
    </md-toolbar>
  </div>
</template>

<script>
export default {
  name: 'Graph',
  data() {
    return {
      READ_ONLY: this.$store.state,
    };
  },
};
</script>

<style>
  img {
    margin-bottom: 16px;
  }
</style>
