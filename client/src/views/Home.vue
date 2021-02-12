<template>
  <div>
    <Navbar/>
    <div class="md-gutter md-alignment-top-space-around home">
      <div class="models">
        <Models/>
      </div>
      <div class="graph">
        <Graph :plotSvgElementId="plotSvgElementId"/>
      </div>
      <div class="download">
        <Download :plotSvgElementId="plotSvgElementId"/>
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
  data() {
    return {
      /**
       * Defined at the top level because of its usage across components
       */
      plotSvgElementId: 'plot-svg',
    };
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
    padding-bottom: 16px;
  }
  /* 959px is the same as md-small in vue material */
  @media (max-width: 959px) {
    .home {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      grid-template-areas:
        "models"
        "graph"
        "download";
      row-gap: 16px;
      margin: 16px;
    }
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
