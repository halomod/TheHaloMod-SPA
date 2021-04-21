<template>
  <md-toolbar class="md-large md-layout">
    <div v-if="plotDataExists()" class="graph-container">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <h3 class="md-title">Plot</h3>
          <md-icon class="tooltip">
              help
              <md-tooltip md-direction="right"
                >Interactive plots for all created models.
                  X and Y axis are configurable.</md-tooltip
              >
            </md-icon>
        </div>
      </div>
      <div class="md-layout-item md-size-100 md-layout md-gutter">
        <md-field
          v-if="xAxisChoices"
          class="md-layout-item md-gutter md-medium-size-50 md-xsmall-size-100"
        >
          <label for="xAxisChoice">X-Axis</label>
          <md-select v-model="xAxisChoice" id="xAxisChoices" name="xAxisChoice">
            <md-option
              v-for="(_, key) in xAxisChoices"
              :key="key"
              :value="key"
            >
              {{plotMetaData[key].name}}
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
        <md-field class="md-layout-item md-gutter md-medium-size-50 md-xsmall-size-100">
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
              {{plotMetaData[choice].name}}
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
import Error from '@/components/Error.vue';
import { PLOT_AXIS_METADATA, PLOT_AXIS_OPTIONS } from '@/constants/PLOT.js';
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
      xAxisChoice: this.$store.state.plot.x,
      /**
       * @type {string[] | null}
       */
      yAxisChoices: null,
      /**
       * @type {string | null}
       */
      yAxisChoice: this.$store.state.plot.y,
      plotElementId: 'd3-chart',
      plotMetaData: PLOT_AXIS_METADATA,
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
  async created() {
    /**
     * Go through each key, value pair in PLOT_AXIS_OPTIONS and add all the
     * x values as an object with their associated axis section ("m", "r", etc.)
     */
    Object.entries(PLOT_AXIS_OPTIONS).forEach(([key, value]) => {
      value.x.forEach((item) => {
        this.xAxisChoices[item] = key;
      });
    });

    // If xAxisChoice has not been chosen, choose the one specified by issue
    // #110, power_auto_tracer as the y and "k_hm" as the x.
    if (this.xAxisChoice === '') {
      const newXAxisChoice = 'k_hm';
      const newYAxisChoice = 'power_auto_tracer';
      this.xAxisChoice = newXAxisChoice;
      this.updateXAxisChoice(newXAxisChoice, '');
      await this.$nextTick();
      this.yAxisChoice = newYAxisChoice;
    }

    if (this.yAxisChoice !== null) {
      this.updateYAxisChoices(this.xAxisChoice);
    }
  },
  watch: {
    xAxisChoice(newXAxisChoice, oldXAxisChoice) {
      this.updateXAxisChoice(newXAxisChoice, oldXAxisChoice);
    },
    yAxisChoice(newYAxisChoice, oldYAxisChoice) {
      if (newYAxisChoice !== null && newYAxisChoice !== oldYAxisChoice) {
        this.$store.setPlotType(newYAxisChoice, 'y', true);
        this.logy = this.$store.state.plot.logy;
      }
    },
    logx(newLog, oldLog) {
      if (newLog !== oldLog) {
        this.$store.setPlotAxisScale('x', newLog);
      }
    },
    logy(newLog, oldLog) {
      if (newLog !== oldLog) {
        this.$store.setPlotAxisScale('y', newLog);
      }
    },
  },
  methods: {
    /**
     * Updates the X Axis Choice. The purpose of this is to separate the logic
     * of updating the x axis choice so it can be called in a watcher and in
     * the initialization logic.
     */
    updateXAxisChoice(newXAxisChoice, oldXAxisChoice) {
      this.updateYAxisChoices(newXAxisChoice);

      // Set the new Y Axis and logy
      const [newYAxisChoice] = this.yAxisChoices;
      this.yAxisChoice = newYAxisChoice;
      this.$store.setPlotType(newYAxisChoice, 'y', false);
      this.logy = this.$store.state.plot.logy;

      // Set the new X Axis and logx. Only refresh if the old x axis is in the
      // same section as the new x.
      this.$store.setPlotType(newXAxisChoice, 'x', this.xAxisChoices[newXAxisChoice] === this.xAxisChoices[oldXAxisChoice]);
      this.logx = this.$store.state.plot.logx;
    },
    updateYAxisChoices(xAxisChoice) {
      this.yAxisChoices = PLOT_AXIS_OPTIONS[this.xAxisChoices[xAxisChoice]].y;
    },
    /**
     * Determines if plot data exists.
     *
     * @returns {boolean} true if it does
     */
    plotDataExists() {
      const { plotData } = this.$store.state.plot;
      return plotData !== null && Object.keys(plotData.plot_data).length !== 0;
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
