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
       <md-button @click="updateImage">Update graph</md-button>
    </md-toolbar>
  </div>
</template>

<script>
export default {
  name: 'Graph',
  data() {
    return {
      image: null,
    };
  },
  methods: {
    async updateImage() {
      this.image = await this.$store.createPlot('dndm');
    },
  },
};
</script>

<style>

</style>
