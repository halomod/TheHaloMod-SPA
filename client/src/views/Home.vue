<template>
  <div>
    <Navbar/>
    <div class="md-layout md-gutter md-alignment-top-space-around home">
      <div class="md-layout-item md-small-size-100">
        <Models/>
      </div>
      <div class="md-layout-item md-small-size-100 graph">
        <Graph/>
      </div>
    </div>
  </div>
</template>

<script>
import Models from '@/components/Models.vue';
import Graph from '@/components/Graph.vue';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'Home',
  components: {
    Models,
    Graph,
    Navbar,
  },

};

</script>

<style scoped>
  .md-layout-item {
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .graph {
    flex-grow: 2;
  }
  .home {
    margin-left: 16px;
    margin-right: 16px;
  }
</style>
