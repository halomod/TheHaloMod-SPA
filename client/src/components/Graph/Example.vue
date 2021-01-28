<template>
  <div id="test">This is an example</div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'Example',
  props: {
    d3PlotData: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    console.log('Example component built');
    this.buildChart();
  },
  watch: {
    d3PlotData() {
      console.log('data changed');
      this.buildChart();
    },
  },
  methods: {
    buildChart() {
      /* const dataset = [
        [34, 78],
        [109, 280],
        [310, 120],
        [79, 411],
        [420, 220],
        [233, 145],
        [333, 96],
        [222, 333],
        [78, 320],
        [21, 123],
      ]; */
      console.log(this.d3PlotData);

      const w = 500;
      const h = 500;
      const padding = 60;

      console.log('It got here');
      const datasets = Object.values(this.d3PlotData.plot_data);
      console.log(' And It got here');
      const minXVal = d3.min(datasets, (d) => d.xs[0]);
      const minYVal = d3.min(datasets, (d) => d.ys[d.ys.length - 1]);
      const maxXVal = d3.max(datasets, (d) => d.xs[d.xs.length - 1]);

      // Y max is actually the first value when it is returned from server.
      const maxYVal = d3.max(datasets, (d) => d.ys[0]);

      console.log(minXVal, maxXVal, minYVal, maxYVal);

      const xScale = d3.scaleLog()
        .domain([minXVal, maxXVal])
        .range([padding, w - padding]);

      const yScale = d3.scaleLog()
        .domain([minYVal, maxYVal])
        .range([h - padding, padding]);

      const svg = d3.select('#test')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

      // Take each set of data points and put them on the plot
      Object.values(datasets).forEach((dataset) => {
        // Map each point to an array where it has the x, y value in each entry
        const coordsArr = dataset.xs.map((val, index) => [
          val,
          dataset.ys[index],
        ]);
        console.log(coordsArr);
        svg.append('path')
          .datum(coordsArr)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 1.5)
          .attr('d', d3.line()
            .x((data) => xScale(data[0]))
            .y((data) => yScale(data[1])));
      });

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
        .attr(
          'transform',
          `translate(0,${h - padding})`,
        )
        .call(xAxis);
      svg.append('g')
        .attr('transform', `translate(${padding},0)`)
        .call(yAxis);
    },
  },
};
</script>

<style>

</style>
