<template>
  <div>
    <md-toolbar class="md-large">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <h3 class="md-title">Plot</h3>
        </div>
      </div>
      <md-field v-if="xAxisChoices">
        <label for="xAxisChoice">X-Axis</label>
        <md-select v-model="xAxisChoice" id="xAxisChoices" name="xAxisChoice">
          <md-option
            v-for="choice in xAxisChoices"
            :key="choice"
            :value="choice"
          >
            {{choice}}
          </md-option>
        </md-select>
        <label for="yAxisChoice">Y-Axis</label>
        <md-select v-if="xAxisChosen" v-model="yAxisChoice" id="yAxisChoices" name="yAxisChoice">
          <md-option
            v-for="choice in yAxisChoices"
            :key="choice"
            :value="choice"
          >
            {{choice}}
          </md-option>
        </md-select>
      </md-field>
      <Plot
        :id="plotElementId"
        v-if="plotDataExists()"
        :plotData="READ_ONLY.plotData"
        :plotType="READ_ONLY.plotType"
        :plotElementId="plotElementId"
      />
      <p id="no-graph-notification" v-else>No graph has been generated yet</p>
      <Error v-if="READ_ONLY.error" :type="READ_ONLY.errorType" :message="READ_ONLY.errorMessage"/>
    </md-toolbar>
  </div>
</template>

<script>
import clonedeep from 'lodash.clonedeep';
import Plot from './Plot.vue';
import Error from '../Error.vue';

export default {
  name: 'Graph',
  data() {
    return {
      READ_ONLY: this.$store.state,
      /**
       * @type {string[] | null}
       */
      xAxisChoices: null,
      /**
       * @type {string | null}
       */
      xAxisChoice: null,
      /**
       * @type {string[] | null}
       */
      yAxisChoices: null,
      /**
       * @type {string | null}
       */
      yAxisChoice: null,
      plotOptions: null,
      plotElementId: 'd3-chart',
    };
  },
  components: {
    Plot,
    Error,
  },
  computed: {
    xAxisChosen() {
      return this.xAxisChoice !== null;
    },
  },
  async created() {
    const { plotOptions, xLabels } = clonedeep(this.READ_ONLY.plotTypes);
    this.xAxisChoices = Object.values(xLabels);
    this.plotOptions = plotOptions;

    const plotOptionKeys = Object.keys(plotOptions);
    if (plotOptionKeys.includes('dndm')) {
      this.plotChoice = 'dndm';
    } else {
      [this.plotChoice] = plotOptionKeys;
    }
  },
  watch: {
    xAxisChoice(newXAxisChoice) {
      console.log('X axis was changed to ', newXAxisChoice);
      this.yAxisChoices = Object.values(this.plotOptions).reduce((returnArr, plotOption) => {
        if (plotOption.xlab === newXAxisChoice) {
          returnArr.push(plotOption.ylab);
          return returnArr;
        }
        return returnArr;
      });
    },
    plotChoice(newPlotChoice, oldPlotChoice) {
      if (newPlotChoice !== null && newPlotChoice !== oldPlotChoice) {
        this.$store.setPlotType(newPlotChoice);
      }
    },
  },
  methods: {
    /**
     * Determines if plot data exists.
     *
     * @returns {boolean} true if it does
     */
    plotDataExists() {
      return this.READ_ONLY.plotData !== null
        && Object.values(this.READ_ONLY.plotData.plot_data).length !== 0;
    },

  },
};
</script>

<style>
  img {
    margin-bottom: 16px;
  }
</style>
