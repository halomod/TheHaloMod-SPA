<template>
  <div :id="plotElementId" class="plot"></div>
</template>
<script>

import Debug from 'debug';
import debounce from 'lodash.debounce';
import buildPlot from '../../utils/plot';

const debug = Debug('Plot.vue');
debug.enabled = false;

export default {
  name: 'Plot',
  props: {
    plotData: {
      type: Object,
      required: true,
    },
    plotElementId: {
      type: String,
      required: true,
    },
    plotSvgElementId: {
      type: String,
      required: true,
    },
    /**
     * Used to just determine edge cases for logarithmic scales in the x-axis.
     * This data could likely be stored at a higher level about each plot type.
     * Right now, only the y-axis has some kind of indicator that it is
     * logarithmic.
     */
    plotType: {
      type: String,
      required: false,
    },
  },
  mounted() {
    // Init
    this.generatePlot();
    /* Debounce only runs the function, even after many calls, once every
    so many ms listed in the second arg. This helps speed up the UI on
    resize. https://lodash.com/docs/4.17.15#debounce */
    window.addEventListener('resize', debounce(this.generatePlot, 400));
  },
  watch: {
    plotData() {
      debug('Data changed');
      this.generatePlot();
    },
  },
  methods: {
    generatePlot() {
      debug('plot being built');
      buildPlot(this.plotElementId, this.plotSvgElementId, this.plotData, this.plotType);
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', debounce(this.generatePlot, 150));
  },
};
</script>

<style>
.plot {
  margin: 32px;
  display: flex;
  align-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
/* Below are used from the `plot.js` file. They need to exist or the plot will
not render correctly. */
.grid line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  shape-rendering: crispEdges;
}
.grid path {
  stroke-width: 0;
}
/* End usage from `plot.js` file */
</style>
