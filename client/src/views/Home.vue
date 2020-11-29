<template>
  <div class="md-layout md-gutter md-alignment-top-space-around home">
    <div class="md-layout-item md-small-size-100">
      <Models
        @update-plot="updatePlot"
      />
    </div>
    <div class="md-layout-item md-small-size-100 graph">
      <Graph
        :image="image"
      />
    </div>
  </div>
</template>

<script>
import Models from '@/components/Models';
import Graph from '../components/Graph.vue';

export default {
  name: 'Home',
  data() {
    return {
      image: null,
    };
  },
  components: {
    Models,
    Graph,
  },
  created() {
    this.updatePlot('dndm');
  },
  methods: {
    async updatePlot(plotType) {
      this.image = await this.$store.createPlot(plotType);
    },
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
