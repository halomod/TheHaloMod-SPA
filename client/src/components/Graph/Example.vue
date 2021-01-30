<template>
  <div id="test" class="plot"></div>
</template>
<script>
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';

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
      const padding = 80;

      const datasets = Object.values(this.d3PlotData.plot_data);

      const minXVal = d3.min(datasets, (d) => d3.min(d.xs));
      const minYVal = d3.min(datasets, (d) => d3.min(d.ys));
      const maxXVal = d3.max(datasets, (d) => d3.max(d.xs));
      const maxYVal = d3.max(datasets, (d) => d3.max(d.ys));

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

      // Clear all SVGs if they exist
      d3.select('#test').selectAll('svg').remove();

      // Build the svg where the plot will be placed
      const svg = d3.select('#test')
        .append('svg')
        .attr('id', 'plot')
        .attr('width', w)
        .attr('height', h)
        .attr('margin', '16px');

      // Build the color generator for the lines
      const colorGen = d3.scaleSequential()
        .domain([0, datasets.length - 1])
        .interpolator(d3.interpolateRainbow);

      // Take each set of data points and put them on the plot
      Object.values(datasets).forEach((dataset, i) => {
        // Map each point to an array where it has the x, y value in each entry
        const coordsArr = dataset.xs.map((val, index) => [
          val,
          dataset.ys[index],
        ]);
        svg.append('path')
          .datum(coordsArr)
          .attr('fill', 'none')
          .attr('stroke', colorGen(i))
          .attr('stroke-width', 1.5)
          .attr('d', d3.line()
            .x((data) => xScale(data[0]))
            .y((data) => yScale(data[1])));
        svg.append('path');
      });

      this.generateLegend(svg, colorGen);

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

      // Get the MathJax obect, which is inserted in the `public/index.html` file
      const { MathJax } = window;

      // Reset MathJax for numbering reasons in equations
      MathJax.texReset();

      // Process the labels into a proper latex string
      const xLabel = this.processLatexString(this.d3PlotData.plot_details.xlab);
      const yLabel = this.processLatexString(this.d3PlotData.plot_details.ylab);

      // x-Axis label initial placement
      svg.append('svg')
        .attr('id', 'x-axis')
        .attr('y', h - 24);
      const plotSvg = document.getElementById('plot');
      const xAxisNode = document.getElementById('x-axis');
      const xAxisLatexOptions = MathJax.getMetricsFor(xAxisNode);
      const xAxisLatexSvg = MathJax.tex2svg(xLabel, xAxisLatexOptions)
        .firstChild;
      xAxisNode.append(xAxisLatexSvg);

      // Center the x-axis
      xAxisNode.setAttribute('x', (plotSvg.getAttribute('width') / 2)
        - ((xAxisLatexSvg.getBoundingClientRect().width) / 2));

      // y-Axis Placement
      svg.append('g')
        .attr('id', 'y-axis');

      const yAxisNode = document.getElementById('y-axis');
      const yAxisLatexOptions = MathJax.getMetricsFor(yAxisNode);
      const yAxisLatexSvg = MathJax.tex2svg(yLabel, yAxisLatexOptions)
        .firstChild;
      yAxisNode.append(yAxisLatexSvg);
      yAxisNode.setAttribute('transform-origin', 'center');
      yAxisNode.setAttribute('transform', 'rotate(-90)');
      yAxisLatexSvg.setAttribute('x', plotSvg.getAttribute('height') / 2
        - (yAxisLatexSvg.getBoundingClientRect().height / 2));
    },
    /**
     * Processes a latex string from the server into something that MathJax
     * will happily accept 😁.
     *
     * @param {string} string the string to turn into a proper latex string
     * which can be processed
     * @returns {string} the output string to be provided to MathJax
     */
    processLatexString(rawLatex) {
      return rawLatex
        .trim()
        .split(/\$/g)
        .reduce((label, string, index) => {
          if (index % 2 === 0) {
            return `${label}\\textrm{${string}}`;
          }
          return label + string;
        // Uses an empty string as the second argument to reduce so that it uses
        // that as the starting point instead of the first array value.
        }, '');
    },
    generateLegend(svg, colorGen) {
      const dataSetNames = Object.keys(this.d3PlotData.plot_data);
      const svgWidthInt = Number.parseInt(svg.style('width'), 10);
      svg.append('g')
        .attr('class', 'legendColor')
        .attr('transform', `translate(${svgWidthInt / 2},20)`);
      const colorLegend = legendColor()
        .scale(colorGen)
        .orient('veritcal')
        .labels(({
          i,
        }) => dataSetNames[i])
        .on('cellclick', () => {
          console.log('clicked!');
        });
      svg
        .selectAll('dataLegend')
        .data(dataSetNames)
        .enter()
        .append('g')
        .append('text')
        .attr('x', (d, i) => 30 + i * 60)
        .attr('y', (d, i) => 30 + i * 60)
        .text((d) => d)
        .style('fill', (d, i) => colorGen(i))
        .style('font-size', 15)
        .on('click', (d) => {
          // is the element currently visible ?
          const currentOpacity = d3.selectAll(`.${d}`).style('opacity');
          // Change the opacity: from 0 to 1 or from 1 to 0
          d3.selectAll(`.${d}`).transition().style('opacity', currentOpacity === 1 ? 0 : 1);
        });
      svg.select('.legendColor')
        .call(colorLegend);
      console.log(svg.style('width'));
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
</style>
