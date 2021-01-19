<template>
  <div>
    <md-toolbar class="md-large">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <h3 class="md-title">Plot</h3>
        </div>
      </div>
      <Chart v-if="READ_ONLY.plotData !== null" :chartData="READ_ONLY.plotData"
      :styles="chartStyles"/>
      <p v-else>No graph has been generated yet</p>
    </md-toolbar>
  </div>
</template>

<script>
import Chart from './Chart.vue';

export default {
  name: 'Graph',
  data() {
    return {
      READ_ONLY: this.$store.state,
    };
  },
  components: {
    Chart,
  },
  computed: {
    chartStyles() {
      return {
        width: '800px',
      };
    },
  },
};
</script>

<style>
  img {
    margin-bottom: 16px;
  }
</style>
