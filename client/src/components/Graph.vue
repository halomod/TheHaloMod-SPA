<template>
  <div>
    <md-toolbar class="md-large">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <h3 class="md-title">Plot</h3>
        </div>
      </div>
      <md-field v-if="plotChoices">
        <label for="plotChoices">Plot Type</label>
        <md-select v-model="plotChoice" id="plotChoices" name="plotChoice">
          <md-option
            v-for="choice in plotChoices"
            :key="choice"
            :value="choice"
          >
            {{choice}}

          </md-option>
        </md-select>
      </md-field>
      <Chart v-if="READ_ONLY.plotData !== null && READ_ONLY.plotDetails !== null"
          :chartData="READ_ONLY.plotData"
          :options="READ_ONLY.plotOptions"
          :styles="chartStyles"/>
      <p v-else>No graph has been generated yet</p>
    </md-toolbar>
  </div>
</template>

<script>
import axios from 'axios';
import baseurl from '@/env';
import Chart from './Chart.vue';

axios.defaults.withCredentials = true;

export default {
  name: 'Graph',
  data() {
    return {
      READ_ONLY: this.$store.state,
      plotChoices: null,
      plotChoice: null,
    };
  },
  components: {
    Chart,
  },
  computed: {
    chartStyles() {
      return {
        position: 'relative',
        margin: '16px auto',
        height: '70vh',
        width: '50vw',
      };
    },
  },
  async created() {
    let plotChoices = [];
    try {
      const result = await axios.get(`${baseurl}/get_plot_types`);
      const plotTypes = result.data;
      plotChoices = Object.keys(plotTypes);
    } catch (error) {
      // Might be better to tell the user here once the snackbar is ready.
      // console.error(error);
    }
    if (plotChoices.includes('dndm')) {
      this.plotChoice = 'dndm';
    } else {
      [this.plotChoice] = plotChoices;
    }

    this.plotChoices = plotChoices;
  },
  watch: {
    plotChoice(newPlotChoice, oldPlotChoice) {
      if (newPlotChoice !== null && newPlotChoice !== oldPlotChoice) {
        this.$store.setPlotType(newPlotChoice);
      }
    },
  },
};
</script>

<style>
  img {
    margin-bottom: 16px;
  }
</style>
