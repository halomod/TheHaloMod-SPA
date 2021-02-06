<template>
  <div :id="plotElementId" class="plot"></div>
</template>
<script>

import Debug from 'debug';
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
  },
  mounted() {
    buildPlot(this.plotElementId, this.plotData);
  },
  watch: {
    plotData() {
      debug('Data changed');
      buildPlot(this.plotElementId, this.plotData);
    },
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
