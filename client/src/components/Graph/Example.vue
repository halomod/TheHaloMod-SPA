<template>
  <div id="test">This is an example</div>
</template>

<script>
import * as d3 from 'd3';
import katex from 'katex';

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
      console.log(this.d3PlotData);

      const w = 500;
      const h = 500;
      const padding = 60;

      const datasets = Object.values(this.d3PlotData.plot_data);

      // Y max is actually the first value when it is returned from server.
      const minXVal = d3.min(datasets, (d) => d.xs[0]);
      const minYVal = d3.min(datasets, (d) => d.ys[d.ys.length - 1]);
      const maxXVal = d3.max(datasets, (d) => d.xs[d.xs.length - 1]);
      const maxYVal = d3.max(datasets, (d) => d.ys[0]);

      let xScale;
      let yScale;
      if (this.d3PlotData.plot_details.yscale === 'log') {
        xScale = d3.scaleLog();
        yScale = d3.scaleLog();
      } else {
        xScale = d3.scaleLinear();
        yScale = d3.scaleLinear();
      }
      xScale = xScale
        .domain([minXVal, maxXVal])
        .range([padding, w - padding]);
      yScale = yScale
        .domain([minYVal, maxYVal])
        .range([h - padding, padding]);

      // Build the svg where the plot will be placed
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

      // x-Axis label
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('class', 'testing-this')
        .attr('x', w / 2)
        .attr('y', h - 6)
        .text('income per capita, inflation-adjusted (dollars)');

      // LEFT OFF: Trying to figure out how to smash an HTML element into an
      // SVG. THEN YOU WIN.

      console.log(katex.renderToString('c = \\pm\\sqrt{a^2 + b^2}'));

      d3.select('class')
        .text('something else');
      // y-Axis label
      d3.select('#test').append('div')
        .attr('x', -10)
        .appendHTML('<p>This is a paragraph</p>');

      /*
        .attr('text-anchor', 'middle')
        .attr('x', -(w / 2))
        .attr('y', 6)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .html(katex.renderToString('c = \\pm\\sqrt{a^2 + b^2}', {
          throwOnError: false,
        })); */
    },
  },
};
</script>

<style>

</style>
