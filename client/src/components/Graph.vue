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
      <Chart v-if="READ_ONLY.plotData !== null"
          :chartData="READ_ONLY.plotData"
          :options="options"
          :styles="chartStyles"/>
      <p v-else>No graph has been generated yet</p>
      <Error v-if="READ_ONLY.error" :message="READ_ONLY.errorMessage"/>
    </md-toolbar>
  </div>
</template>

<script>
import axios from 'axios';
import baseurl from '@/env';
import Chart from './Chart.vue';
import Error from './Error.vue';

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
    Error,
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
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'right',
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.READ_ONLY.plotDetails.yLabel,
            },
            type: this.READ_ONLY.plotDetails.scale,
            ticks: {
              precision: 0,
              beginAtZero: false,
            },
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.READ_ONLY.plotDetails.xLabel,
            },
            type: this.READ_ONLY.plotDetails.scale,
            ticks: {
              precision: 0,
              beginAtZero: false,
            },
          }],
        },
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
