<template>
  <div>
    <Navbar/>
    <div class="md-gutter md-alignment-top-space-around home">
      <div class="md-layout-item md-small-size-100 models">
        <Models/>
      </div>
      <div class="md-layout-item md-small-size-100 graph">
        <Graph/>
      </div>
      <div class="md-layout-item md-small-size-100 download">
        <Download/>
      </div>
    </div>
  </div>
</template>

<script>
import Models from '@/components/Models';
import Graph from '@/components/Graph';
import Navbar from '@/components/Navbar';
import Download from '@/components/Download';

export default {
  name: 'Home',
  components: {
    Models,
    Graph,
    Navbar,
    Download,
  },
};

</script>

<style scoped>
  .home {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: auto;
    grid-template-areas:
      "models graph"
      "download graph"
      ". graph";
    column-gap: 16px;
    row-gap: 16px;
    margin: 16px;
  }
  .graph {
    grid-area: graph;
  }
  .models {
    grid-area: models;
  }
  .download {
    grid-area: download;
  }
</style>
