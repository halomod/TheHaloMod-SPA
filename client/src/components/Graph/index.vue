<template>
  <md-toolbar class="md-large md-layout">
    <div v-if="plotDataExists()" class="graph-container">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <h3 class="md-title">Plot</h3>
        </div>
      </div>
      <div class="md-layout-item md-size-100 md-layout md-gutter">
        <md-field v-if="xAxisChoices" class="md-layout-item md-gutter md-size-85">
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
        </md-field>
        <md-checkbox
          v-model="logx"
          class="md-layout-item md-gutter"
        >
          Logarithmic scale
        </md-checkbox>
      </div>
      <div class="md-layout-item md-size-100 md-layout md-gutter">
        <md-field class="md-layout-item md-gutter md-size-85">
          <label for="yAxisChoice">Y-Axis</label>
          <md-select
            v-if="xAxisChosen"
            v-model="yAxisChoice"
            id="yAxisChoices"
            name="yAxisChoice"
          >
            <md-option
              v-for="choice in yAxisChoices"
              :key="choice"
              :value="choice"
            >
              {{plotData[choice].name}}
            </md-option>
          </md-select>
        </md-field>
        <md-checkbox
          v-model="logy"
          class="md-layout-item md-gutter"
        >
          Logarithmic scale
        </md-checkbox>
      </div>
      <Plot
        :id="plotElementId"
        :plotData="READ_ONLY.plot.plotData"
        :plotElementId="plotElementId"
        :xlog="logx"
        :ylog="logy"
      />
    </div>
    <p id="no-graph-notification" v-else>No graph has been generated yet</p>
    <Error v-if="READ_ONLY.error" :type="READ_ONLY.errorType" :message="READ_ONLY.errorMessage"/>
  </md-toolbar>
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
      logx: this.$store.state.plot.logx,
      logy: this.$store.state.plot.logy,
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
    logx() {
      console.log('logx was changed');
    },
  },
  methods: {
    /**
     * Determines if plot data exists.
     *
     * @returns {boolean} true if it does
     */
    plotDataExists() {
      const { plotData } = this.$store.state.plot;
      return plotData !== null && Object.keys(plotData.plot_data).length !== 0;
    },
    getAxisScale(axis) {
      const plottype = this.READ_ONLY.plot[axis];
      return PLOT_AXIS_METADATA[plottype]?.scale === 'log';
    },
  },
};
</script>

<style scoped>
  img {
    margin-bottom: 16px;
  }
  .graph-container {
    width: 100%;
  }
</style>
