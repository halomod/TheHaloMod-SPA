<template>
  <div class="md-layout md-gutter md-alignment-top-center">
    <div class="md-layout-item md-large-size-45 md-small-size-90">
      <Models/>
    </div>
    <div class="md-layout-item md-large-size-45 md-small-size-90">
      <Graph/>
    </div>
  </div>
</template>

<script>
import Models from '../components/Models.vue';
import Graph from '../components/Graph.vue';

export default {
  name: 'Home',
  // TODO: Make the data at the app level and learn how to pass this to routes
  data: () => ({}),
  components: {
    Models,
    Graph,
  },
};

</script>

<style scoped>
  .md-layout-item {
    margin-top: 16px;
    margin-bottom: 16px;
  }
</style>
