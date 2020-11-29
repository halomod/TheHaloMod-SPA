<template>
  <div>
    <md-toolbar class="md-large">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <h3 class="md-title">Plot</h3>
        </div>
      </div>
      <img v-if="image !== null" :src="image"/>
      <p v-else>No graph has been generated yet</p>
    </md-toolbar>
  </div>
</template>

<script>
export default {
  name: 'Graph',
  props: {
    image: {
      type: String,
    },
  },
};
</script>

<style>
  img {
    margin-bottom: 16px;
  }
</style>
