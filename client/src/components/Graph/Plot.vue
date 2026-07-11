<template>
  <div :id="plotElementId" class="plot" />
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
    /**
     * Only used to rerender at the correct time.
     */
    plotData: {
      required: true,
    },
    plotElementId: {
      type: String,
      required: true,
    },
  },
  async mounted() {
    // Wait until the component is fully rendered so that the plot gets the
    // right size.
    await this.$nextTick();
    this.generatePlot();
    /* Debounce only runs the function, even after many calls, once every
    so many ms listed in the second arg. This helps speed up the UI on
    resize. https://lodash.com/docs/4.17.15#debounce */
    window.addEventListener('resize', debounce(this.generatePlot, 200));
  },
  watch: {
    plotData: {
      deep: true,
      handler() {
        debug('plotData changed');
        this.generatePlot();
      },
    },
  },
  methods: {
    generatePlot() {
      debug('plot being built');
      buildPlot(
        this.plotElementId,
        this.$store.state.plot,
        this.$store.state.modelNames,
        this.$store.state.plot.logx,
        this.$store.state.plot.logy,
      );
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', debounce(this.generatePlot, 150));
  },
};
</script>

<style>
.plot {
  margin-bottom: 16px;
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
.dashed {
  stroke-dasharray: 6,6;
}
.dotted {
  stroke-dasharray: 3,3;
}
/* End usage from `plot.js` file */
</style>
