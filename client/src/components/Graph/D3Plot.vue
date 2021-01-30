<template>
  <div id="test" class="plot"></div>
</template>
<script>
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import Debug from 'debug';

const debug = Debug('D3Plot.vue');
debug.enabled = true;

export default {
  name: 'D3Plot',
  props: {
    d3PlotData: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.buildChart();
  },
  watch: {
    d3PlotData() {
      debug('Data changed');
      this.buildChart();
    },
  },
  methods: {
    buildChart() {
      // Clear all SVGs within the main element if they exist
      d3.select('#test').selectAll('svg').remove();

      // Build the svg where the plot will be placed
      const svg = d3.select('#test')
        .append('svg')
        .attr('id', 'plot')
        .attr('width', '100%')
        .attr('height', 500)
        .attr('margin', '16px');

      const w = svg.node().getBoundingClientRect().width;
      const h = svg.node().getBoundingClientRect().height;

      const { yLabelWidth, xLabelHeight } = this.generateAxisLabels(svg);

      const datasets = Object.values(this.d3PlotData.plot_data);

      // Build the color generator for the lines
      const colorGen = d3.scaleSequential()
        .domain([0, datasets.length - 1])
        .interpolator(d3.interpolateRainbow);

      const legendWidth = this.generateLegend(svg, colorGen);

      const leftPadding = yLabelWidth + 45;
      const bottomPadding = xLabelHeight + 30;
      const rightPadding = legendWidth;

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
        .range([leftPadding, w - rightPadding]);
      yScale = yScale
        .domain([minYVal, maxYVal])
        .range([h - bottomPadding, bottomPadding]);

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
          .attr('class', `line-${i}`)
          .attr('stroke', colorGen(i))
          .attr('stroke-width', 1.5)
          .attr('d', d3.line()
            .x((data) => xScale(data[0]))
            .y((data) => yScale(data[1])));
        svg.append('path');
      });

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
        .attr('id', 'x-axis')
        .attr(
          'transform',
          `translate(0,${h - bottomPadding})`,
        )
        .call(xAxis);
      svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${leftPadding},0)`)
        .call(yAxis);

      // gridlines in x axis function
      function make_x_gridlines() {
        return d3.axisBottom(xScale)
          .ticks(6);
      }

      // gridlines in y axis function
      function make_y_gridlines() {
        return d3.axisLeft(yScale)
          .ticks(6);
      }

      // add the X gridlines
      svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${h - bottomPadding})`)
        .call(make_x_gridlines()
          .tickSize(-(h - bottomPadding * 2))
          .tickFormat(''));

      // add the Y gridlines
      svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(${leftPadding},0)`)
        .call(make_y_gridlines()
          .tickSize(-(w - rightPadding - leftPadding))
          .tickFormat(''));
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
    /**
     * Generates the axis labels for the plot
     *
     * @param {} svg the d3 svg representing the plot svg
     * @returns {{
     *  yLabelWidth: Number,
     *  xLabelHeight: Number
     * }} an object which holds pixel values for the width from the left for
     * the y label and the height from the bottom to get past the x label
     */
    generateAxisLabels(svg) {
      // Get the MathJax obect, which is inserted in the `public/index.html` file
      const { MathJax } = window;

      const h = svg.node().getBoundingClientRect().height;
      const w = svg.node().getBoundingClientRect().width;

      // Reset MathJax for numbering reasons in equations
      MathJax.texReset();

      // Process the labels into a proper latex string
      const xLabel = this.processLatexString(this.d3PlotData.plot_details.xlab);
      const yLabel = this.processLatexString(this.d3PlotData.plot_details.ylab);

      // x-Axis label initial placement
      svg.append('svg')
        .attr('id', 'x-axis-label')
        .attr('y', h - 24);
      const xAxisNode = document.getElementById('x-axis-label');
      const xAxisLatexOptions = MathJax.getMetricsFor(xAxisNode);
      const xAxisLatexSvg = MathJax.tex2svg(xLabel, xAxisLatexOptions)
        .firstChild;
      xAxisNode.append(xAxisLatexSvg);

      // Center the x-axis
      xAxisNode.setAttribute('x', (w / 2)
        - ((xAxisLatexSvg.getBoundingClientRect().width) / 2));

      // y-Axis Placement
      svg.append('svg')
        .attr('id', 'y-axis-container');
      svg.append('g')
        .attr('id', 'y-axis-label');

      const yAxisNode = document.getElementById('y-axis-label');
      const yAxisContainer = document.getElementById('y-axis-container');
      yAxisContainer.append(yAxisNode);

      const yAxisLatexOptions = MathJax.getMetricsFor(yAxisNode);
      const yAxisLatexSvg = MathJax.tex2svg(yLabel, yAxisLatexOptions)
        .firstChild;

      yAxisNode.append(yAxisLatexSvg);
      // yAxisNode.setAttribute('transform-origin', 'center center');

      // Rotation happens at the pivot point of the top left corner by default
      yAxisNode.setAttribute('transform', 'rotate(-90)');

      /* Get the yAxisLatexSvg back to the top left of the SVG after rotation
      then calculate the half way point to line it up at */
      const yAxisLatexBBox = yAxisLatexSvg.getBoundingClientRect();
      yAxisContainer.setAttribute('y', yAxisLatexBBox.height
        + (h / 2)
        - (yAxisLatexBBox.height / 2));
      yAxisContainer.setAttribute('overflow', 'visible');

      return {
        yLabelWidth: yAxisLatexBBox.width,
        xLabelHeight: xAxisLatexSvg.getBoundingClientRect().height,
      };
    },
    /**
     * Creates the legend for the plot.
     *
     * @param {} svg the d3 svg representing the plot svg
     * @param {} colorGen the d3 color scale for the plot
     * @returns {Number} the width of the Legend
     */
    generateLegend(svg, colorGen) {
      const dataSetNames = Object.keys(this.d3PlotData.plot_data);
      const w = svg.node().getBoundingClientRect().width;
      const h = svg.node().getBoundingClientRect().height;
      svg.append('g')
        .attr('id', 'legendColor')
        .attr('transform', `translate(${w / 2},20)`);
      const colorLegend = legendColor()
        .scale(colorGen)
        .orient('veritcal')
        .labels(({
          i,
        }) => dataSetNames[i])
        .labelWrap(150)
        .on('cellclick', (event) => {
          const tspanNode = event.target.parentNode.querySelector('tspan');
          const nodeText = tspanNode.textContent;
          const cellIndex = dataSetNames.indexOf(nodeText);
          const classString = `.line-${cellIndex}`;
          // is the element currently visible ?
          const currentOpacity = d3.selectAll(classString).style('opacity');
          // Change the opacity: from 0 to 1 or from 1 to 0
          if (currentOpacity === '1') {
            d3.selectAll(classString).style('opacity', '0');
            tspanNode.setAttribute('text-decoration', 'line-through');
            tspanNode.setAttribute('fill', 'lightgray');
          } else {
            d3.selectAll(classString).style('opacity', '1');
            tspanNode.removeAttribute('text-decoration');
            tspanNode.removeAttribute('fill');
          }
          const newOpacity = currentOpacity === '1' ? '0' : '1';
          d3.selectAll(classString).style('opacity', newOpacity);
          debug(d3.selectAll(classString).style('opacity'));
        });

      svg.select('#legendColor')
        .call(colorLegend);
      const legendNode = svg.select('#legendColor').node();
      const legendBBox = legendNode.getBoundingClientRect();
      const targetX = w - legendBBox.width;
      const targetY = (h / 2) - (legendBBox.height / 2);
      legendNode.setAttribute('transform', `translate(${targetX},${targetY})`);
      return legendBBox.width;
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
.grid line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  shape-rendering: crispEdges;
}

.grid path {
  stroke-width: 0;
}
</style>
