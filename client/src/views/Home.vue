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
      <div class="md-layout-item md-small-size-100">
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
