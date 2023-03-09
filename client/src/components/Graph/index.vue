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
        :plotData="localPlotState"
        :plotElementId="plotElementId"
      />
    </div>
    <p id="no-graph-notification" v-else>No graph has been generated yet</p>
    <Error
      v-if="STORE_STATE.graphError"
      :type="STORE_STATE.errorType"
      :message="STORE_STATE.errorMessage"/>
  </md-toolbar>
</template>

<script>
import Error from '@/components/Error.vue';
import { PLOT_AXIS_METADATA, PLOT_AXIS_OPTIONS } from '@/constants/PLOT.js';
import Debug from 'debug';
import Plot from './Plot.vue';

const debug = Debug('Graph');
debug.enabled = false;

export default {
  name: 'Graph',
  data() {
    console.log('re-running data!');
    return {
      /**
       * Holds a reference to the state of the store for the application, so
       * whenever there is a change, this variable updates.
       *
       * This should not be edited directly or it will break the connection
       * to the store. Edits should be made by using the functions in the
       * store.
       */
      STORE_STATE: this.$store.state,
      /**
       * Stored locally so that updates to the plot only happen once when
       * changes are made.
       */
      localPlotState: this.$store.state.plot,
      /**
       * Store the HMFcalc mode so that we can update the plot when it changes.
       */
      hmfcalcMode: this.$store.state.hmfcalcMode,
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
    console.log('In created!');
    Object.entries(PLOT_AXIS_OPTIONS).forEach(([key, value]) => {
      console.log('In created(): key: ', key, ' value: ', value);
      value.x.forEach((item) => {
        console.log('In created(): item: ', item, ' key: ', key, ' hmfcalc: ', PLOT_AXIS_METADATA[item].hmfcalc, ' hmfcalcMode: ', this.$store.state.hmfcalcMode);
        if (PLOT_AXIS_METADATA[item].hmfcalc || !this.$store.state.hmfcalcMode) {
          this.xAxisChoices[item] = key;
        }
      });
    });

    console.log('In created(): got xAxisChoices: ', this.xAxisChoices);

    this.setDefaultXaxisChoice();
  },
  watch: {
    localPlotState: {
      deep: true,
      handler(newPlotState) {
        if (newPlotState.logx !== this.logx) {
          this.logx = newPlotState.logx;
        }
        if (newPlotState.logy !== this.logy) {
          this.logy = newPlotState.logy;
        }
      },
    },
    '$store.state.hmfcalcMode': {
      handler(newMode, oldMode) {
        console.log('I am in the hmfcalcMode watcher handler');
        if (newMode !== oldMode) {
          this.xAxisChoices = {};
          Object.entries(PLOT_AXIS_OPTIONS).forEach(([key, value]) => {
            value.x.forEach((item) => {
              if (PLOT_AXIS_METADATA[item].hmfcalc || !newMode) {
                this.xAxisChoices[item] = key;
              }
            });
          });
          console.log('Reset xAxisChoices to ', this.xAxisChoices);
          this.setDefaultXaxisChoice();
          this.updateYAxisChoices(this.xAxisChoice);
        }
      },
    },
    xAxisChoice(newXAxisChoice, oldXAxisChoice) {
      console.log('hmfcalcMode: ', this.hmfcalcMode);
      if (newXAxisChoice !== oldXAxisChoice) {
        this.updateXAxisChoice(newXAxisChoice, oldXAxisChoice);
      }
    },
    yAxisChoice(newYAxisChoice, oldYAxisChoice) {
      if (newYAxisChoice !== oldYAxisChoice) {
        this.updateYAxisChoice(newYAxisChoice, oldYAxisChoice);
      }
    },
    async logx(newLogx) {
      if (newLogx !== this.$store.state.plot.logx) {
        this.localPlotState = await this.$store.setPlotAxisScale('x', newLogx);
      }
    },
    async logy(newLogy) {
      if (newLogy !== this.$store.state.plot.logy) {
        this.localPlotState = await this.$store.setPlotAxisScale('y', newLogy);
      }
    },
  },
  methods: {
    /**
     * Updates the X Axis Choice. The purpose of this is to separate the logic
     * of updating the x axis choice so it can be called in a watcher and in
     * the initialization logic.
     */
    async setDefaultXaxisChoice() {
      // If xAxisChoice is set but doesn't exist in the choices, which can happen
      // when we update the choices due to HMFcalc mode, then undefine it so we can
      // set it to default.
      console.log('setting default x-axis choice...');
      if (!(this.xAxisChoice in this.xAxisChoices)) {
        this.xAxisChoice = '';
      }

      if (this.xAxisChoice === '' || this.xAxisChoice === undefined) {
        let newXAxisChoice = 'm';
        let newYAxisChoice = 'dndlnm';
        if (!this.hmfcalcMode) {
          newXAxisChoice = 'k_hm';
          newYAxisChoice = 'power_auto_tracer';
        }
        this.updateXAxisChoice(newXAxisChoice, '');
        await this.$nextTick();
        this.yAxisChoice = newYAxisChoice;
        this.xAxisChoice = newXAxisChoice;
      }

      if (this.yAxisChoice !== null) {
        this.updateYAxisChoices(this.xAxisChoice);
      }
    },
    async updateXAxisChoice(newXAxisChoice, oldXAxisChoice) {
      /*
       * If the x axis is in a different axis section then both the x and the
       * y as well as y choices need to be updated.
       */
      const isDifferentAxisSection = this.xAxisChoices[newXAxisChoice]
        !== this.xAxisChoices[oldXAxisChoice];
      if (isDifferentAxisSection) {
        const newYAxisChoices = [];
        PLOT_AXIS_OPTIONS[this.xAxisChoices[newXAxisChoice]].y.forEach((choice) => {
          if (PLOT_AXIS_METADATA[choice].hmfcalc || !this.$store.state.hmfcalcMode) {
            newYAxisChoices.push(choice);
          }
        });
        let newYAxisChoice = this.yAxisChoice;
        if (!newYAxisChoices.includes(this.yAxisChoice)) {
          [newYAxisChoice] = newYAxisChoices;
        }

        // Change both the x and y axis in the store and set the state for
        // the component all at once.
        const newPlotState = await this.$store.setBothPlotType(newXAxisChoice, newYAxisChoice);
        Object.assign(this, {
          localPlotState: newPlotState,
          xAxisChoice: newXAxisChoice,
          yAxisChoices: newYAxisChoices,
          yAxisChoice: newYAxisChoice,
        });
      } else {
        if (newXAxisChoice !== this.$store.state.plot.x) {
          this.localPlotState = await this.$store.setPlotType(newXAxisChoice, 'x', true);
        }
        if (newXAxisChoice !== this.xAxisChoice) {
          this.xAxisChoice = newXAxisChoice;
        }
      }
    },
    /**
     * Updates the Y Axis Choice and optionally updates the plot if that isn't
     * already being done elsewhere.
     *
     * @param {string} newYAxisChoice
     * @param {string} oldYAxisChoice
     */
    async updateYAxisChoice(newYAxisChoice, oldYAxisChoice) {
      if (newYAxisChoice !== null && newYAxisChoice !== oldYAxisChoice) {
        if (newYAxisChoice !== this.localPlotState.y) {
          this.localPlotState = await this.$store.setPlotType(newYAxisChoice, 'y', true);
        }

        // Because this function is called sometimes when the current
        // `yAxisChoice` hasn't been updated
        if (this.yAxisChoice !== newYAxisChoice) {
          this.yAxisChoice = newYAxisChoice;
        }
      }
    },
    /**
     * Updates the Y axis choices.
     *
     * @param {string} xAxisChoice the new xAxisChoice
     */
    async updateYAxisChoices(xAxisChoice) {
      const newYAxisChoices = [];
      console.log('About to Reset y-axis choices. Begin with: ', this.yAxisChoices);
      PLOT_AXIS_OPTIONS[this.xAxisChoices[xAxisChoice]].y.forEach((choice) => {
        if (PLOT_AXIS_METADATA[choice].hmfcalc === true || !this.$store.state.hmfcalcMode) {
          console.log('Adding choice: ', choice, ' to y-axis choices, because hmfcalc is ', this.$store.state.hmfcalcMode, ' or metadata.hmfcalc is ', PLOT_AXIS_METADATA[choice].hmfcalc);
          newYAxisChoices.push(choice);
        }
      });
      this.yAxisChoices = newYAxisChoices;
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
