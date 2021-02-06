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
      <Plot
        :id="plotElementId"
        v-if="plotDataExists()"
        :plotData="READ_ONLY.plotData"
        :plotType="READ_ONLY.plotType"
        :plotElementId="plotElementId"
      />
      <p id="no-graph-notification" v-else>No graph has been generated yet</p>
    </md-toolbar>
  </div>
</template>

<script>
import Plot from './Plot.vue';

export default {
  name: 'Graph',
  data() {
    return {
      READ_ONLY: this.$store.state,
      plotChoices: null,
      plotChoice: null,
      plotElementId: 'd3-chart',
    };
  },
  components: {
    Plot,
  },
  async created() {
    const plotChoices = [...this.READ_ONLY.plotTypes];
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
