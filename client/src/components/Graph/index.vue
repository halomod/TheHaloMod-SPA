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
            {{xLabelNames[choice]}}
          </md-option>
        </md-select>

      </md-field>
      <md-field>
        <label for="yAxisChoice">Y-Axis</label>
        <md-select v-if="xAxisChosen" v-model="yAxisChoice" id="yAxisChoices" name="yAxisChoice">
          <md-option
            v-for="choice in yAxisChoices"
            :key="choice"
            :value="choice"
          >
            {{plotNames[choice]}}
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
import Error from '@/components/Error.vue';
import { plotNames, xLabelNames } from '@/constants/plotNames.js';
import Plot from './Plot.vue';

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
      xLabelNames: clonedeep(xLabelNames),
      plotNames: clonedeep(plotNames),
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
    const xAxisChoices = Object.values(xLabels);
    this.xAxisChoices = xAxisChoices;
    if (xAxisChoices.length === 0) {
      this.$store.setError('Plot Choices Error', 'The x axis choices are not'
      + ' avaialble from the server.');
      return;
    }
    [this.xAxisChoice] = xAxisChoices;
    this.plotOptions = plotOptions;
  },
  watch: {
    xAxisChoice(newXAxisChoice) {
      const yAxisChoices = Object.entries(this.plotOptions)
        .reduce((returnArr, [plotName, plotDetails]) => {
          if (plotDetails.xlab === newXAxisChoice) {
            returnArr.push(plotName);
            return returnArr;
          }
          return returnArr;
        }, []);
      this.yAxisChoices = yAxisChoices;
      if (yAxisChoices.length !== 0) {
        [this.yAxisChoice] = yAxisChoices;
      }
    },
    yAxisChoice(newYAxisChoice, oldYAxisChoice) {
      if (newYAxisChoice !== null && newYAxisChoice !== oldYAxisChoice) {
        this.$store.setPlotType(newYAxisChoice);
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
