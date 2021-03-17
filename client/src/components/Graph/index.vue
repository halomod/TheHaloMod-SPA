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
            v-for="(_, key) in xAxisChoices"
            :key="key"
            :value="key"
          >
            {{plotData[key].name}}
          </md-option>
        </md-select>
        <md-checkbox v-model="xlog">log</md-checkbox>
      </md-field>
      <md-field>
        <label for="yAxisChoice">Y-Axis</label>
        <md-select v-if="xAxisChosen" v-model="yAxisChoice" id="yAxisChoices" name="yAxisChoice">
          <md-option
            v-for="choice in yAxisChoices"
            :key="choice"
            :value="choice"
          >
            {{plotData[choice].name}}
          </md-option>
        </md-select>
        <md-checkbox v-model="ylog">log</md-checkbox>
      </md-field>
      <Plot
        :id="plotElementId"
        v-if="plotDataExists()"
        :plotData="READ_ONLY.plot.plotData"
        :plotElementId="plotElementId"
        :xlog="xlog"
        :ylog="ylog"
      />
      <p id="no-graph-notification" v-else>No graph has been generated yet</p>
      <Error v-if="READ_ONLY.error" :type="READ_ONLY.errorType" :message="READ_ONLY.errorMessage"/>
    </md-toolbar>
  </div>
</template>

<script>
// import clonedeep from 'lodash.clonedeep';
import Error from '@/components/Error.vue';
import { PLOT_AXIS_METADATA, PLOT_AXIS_OPIONS } from '@/constants/PLOT.js';
import Plot from './Plot.vue';

export default {
  name: 'Graph',
  data() {
    return {
      READ_ONLY: this.$store.state,
      /**
       * @type {string[] | null}
       */
      xAxisChoices: {},
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
      plotElementId: 'd3-chart',
      plotData: PLOT_AXIS_METADATA,
      xlog: true,
      ylog: true,
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
  created() {
    Object.entries(PLOT_AXIS_OPIONS).forEach((entry) => {
      entry[1].x.forEach((item) => {
        [this.xAxisChoices[item]] = entry;
      });
    });
    [this.xAxisChoice] = Object.keys(this.xAxisChoices);
  },
  mounted() {
    this.xlog = this.getAxisScale('x');
    this.ylog = this.getAxisScale('y');
  },
  watch: {
    xAxisChoice(newXAxisChoice, oldXAxisChoice) {
      this.yAxisChoices = PLOT_AXIS_OPIONS[this.xAxisChoices[newXAxisChoice]]?.y;
      [this.yAxisChoice] = this.yAxisChoices;
      this.$store.setPlotType(newXAxisChoice, 'x', this.xAxisChoices[newXAxisChoice] === this.xAxisChoices[oldXAxisChoice]);
    },
    yAxisChoice(newYAxisChoice, oldYAxisChoice) {
      if (newYAxisChoice !== null && newYAxisChoice !== oldYAxisChoice) {
        this.$store.setPlotType(newYAxisChoice, 'y', true);
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
      return this.READ_ONLY.plot.plotData !== null
        && Object.values(this.READ_ONLY.plot.plotData).length !== 0;
    },
    getAxisScale(axis) {
      const plottype = this.READ_ONLY.plot[axis];
      return PLOT_AXIS_METADATA[plottype]?.scale === 'log';
    },
  },
};
</script>

<style>
  img {
    margin-bottom: 16px;
  }
</style>
