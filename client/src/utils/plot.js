import * as d3 from 'd3';
import Debug from 'debug';
import { legendColor } from 'd3-svg-legend';
import { PLOT_AXIS_METADATA } from '@/constants/PLOT.js';
import createLatexSvgFromString from './latex';

const debug = Debug('plot.js');
debug.enabled = false;

/**
 * Gets the additional class name for a line in the plot to determine if it
 * should be dotted, dashed, or solid based on its index in the list of
 * models.
 *
 * This is based on the idea that the colors are finite for the plot
 * lines. Currently, this function is written as if there are 10 colors.
 *
 * @param {number} index the index of model (line) in the list of models
 */
function getLineClass(index) {
  if (index < 10) {
    return 'solid';
  } if (index < 20) {
    return 'dashed';
  }
  return 'dotted';
}

/**
 * Creates the legend for the plot.
 *
 * @param {d3.Selection<d3.BaseType, any, HTMLElement, any>} svg the d3 svg
 * representing the plot svg
 * @param {d3.ScaleOrdinal<string, any, never>} colorGen the d3 color scale
 * for the plot
 * @param {string[]} dataSetNames the array of names of the models
 * @returns {Number} the width of the Legend
 */
function generateLegend(svg, colorGen, dataSetNames) {
  debug('dataSetNames provided to generateLegend is: ', dataSetNames);
  const plotWidth = svg.node().getBoundingClientRect().width;
  const plotHeight = svg.node().getBoundingClientRect().height;
  svg.append('g')
    .attr('id', 'legendColor')
    .attr('transform', `translate(${plotWidth / 2},20)`);

  // The below scale makes it so class names are output to each legend icon
  const legendScale = d3.scaleOrdinal()
    .domain(dataSetNames)
    .range(['legend-line']);

  const colorLegend = legendColor()
    .scale(legendScale)
    .labels(dataSetNames)
    // Set the word wrap of the legend to 150 pixels
    .labelWrap(150)
    .shape('line')
    .shapeWidth(30)
    .useClass(true)
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
    });

  // Apply the legend
  svg.select('#legendColor')
    .call(colorLegend)
    // Modify the lines for the legend and set their colors as well as
    // modification class if needed.
    .selectAll('.legend-line')
    .attr('stroke', (_, i) => colorGen(i))
    .attr('stroke-width', 4)
    .attr('class', (_, i) => `legend-line ${getLineClass(i)}`);

  const legendNode = svg.select('#legendColor').node();
  const legendBBox = legendNode.getBoundingClientRect();
  const targetX = plotWidth - legendBBox.width;
  const targetY = (plotHeight / 2) - (legendBBox.height / 2);
  legendNode.setAttribute('transform', `translate(${targetX},${targetY})`);
  return legendBBox.width;
}

/**
 * Generates the axis labels for the plot.
 *
 * @param {d3.Selection<d3.BaseType, any, HTMLElement, any>} svg the d3 svg
 * representing the plot svg
 * @returns {{
 *  yLabelWidth: Number,
 *  xLabelHeight: Number
 * }} an object which holds pixel values for the width from the left for
 * the y label and the height from the bottom to get past the x label
 */
function generateAxisLabels(svg, plot) {
  const { x, y } = plot;
  const h = svg.node().getBoundingClientRect().height;
  const w = svg.node().getBoundingClientRect().width;

  // x-Axis label initial placement
  const xAxisLatexSvg = createLatexSvgFromString(PLOT_AXIS_METADATA[x].label);
  const xAxisNode = svg.append('svg')
    .attr('id', 'x-axis-label')
    .node();

  xAxisNode.append(xAxisLatexSvg);

  // The bounding client rect doesn't have a height until it is applied to the
  // svg.
  xAxisNode.setAttribute('y', h - xAxisLatexSvg.getBoundingClientRect().height);

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
  const yAxisLatexSvg = createLatexSvgFromString(PLOT_AXIS_METADATA[y].label);
  yAxisNode.append(yAxisLatexSvg);

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
}

/**
 * Builds the chart which displays the data for each model.
 *
 * @param {string} elementId the ID of the element to manipulate which will
 * become the parent of the SVG plot
 * @param {} plot the plot data which should be held in `$store` of the Vue
 * instance
 * @param {string[]} modelNames the ordered model names that are currently
 * stored
 * @param {boolean} xlog if the x axis should be logarithmic
 * @param {boolean} ylog if the y axis should be logarithmic
 */
export default (elementId, plot, modelNames, xlog, ylog) => {
  debug('plot rendering triggered');
  const { plotData } = plot;
  debug('Generate plot triggered with the following plotData', plotData);
  // Clear all SVGs within the main element if they exist
  d3.select(`#${elementId}`).selectAll('svg').remove();

  // Build the svg where the plot will be placed
  const svg = d3.select(`#${elementId}`)
    .append('svg')
    .attr('id', 'svg-plot')
    .attr('width', '100%')
    .attr('height', 500)
    .attr('margin', 0);

  const w = svg.node().getBoundingClientRect().width;
  const h = svg.node().getBoundingClientRect().height;

  const { yLabelWidth, xLabelHeight } = generateAxisLabels(svg, plot);

  debug(`xLabelHeight is: ${xLabelHeight}`);

  const datasets = modelNames.map((modelName) => plotData.plot_data[modelName]);
  debug('datasets is: ', datasets);

  // Build the color generator for the lines and legend
  const colors = datasets.map((val, i) => d3.rgb(
    // The different color options are here: https://github.com/d3/d3-scale-chromatic
    d3.schemeCategory10[i % 10],
  ).formatHex());
  const colorGen = d3.scaleOrdinal()
    .domain(Object.keys(plotData.plot_data))
    .range(colors);

  const legendWidth = generateLegend(svg, colorGen, modelNames);

  // Adding extra room to the yLabel and xLabel to fit the axis values
  const leftPadding = yLabelWidth + 45;
  const bottomPadding = xLabelHeight + 30;
  const rightPadding = legendWidth;

  const minXVal = d3.min(datasets, (d) => d3.min(d.xs));
  const minYVal = d3.min(datasets, (d) => d3.min(d.ys));
  const maxXVal = d3.max(datasets, (d) => d3.max(d.xs));
  const maxYVal = d3.max(datasets, (d) => d3.max(d.ys));

  let xScale = xlog ? d3.scaleLog() : d3.scaleLinear();
  let yScale = ylog ? d3.scaleLog() : d3.scaleLinear();
  xScale = xScale
    .domain([minXVal, maxXVal])
    .range([leftPadding, w - rightPadding]);
  yScale = yScale
    .domain([minYVal, maxYVal])
    .range([h - bottomPadding, bottomPadding]);

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

  // add the X gridlines, needs to go before the data is plotted
  svg.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${h - bottomPadding})`)
    .call(make_x_gridlines()
      .tickSize(-(h - bottomPadding * 2))
      .tickFormat(''));

  // add the Y gridlines, needs to go before the data is plotted
  svg.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(${leftPadding},0)`)
    .call(make_y_gridlines()
      .tickSize(-(w - rightPadding - leftPadding))
      .tickFormat(''));

  // Take each set of data points and put them on the plot
  Object.values(datasets).forEach((dataset, i) => {
    // Map each point to an array where it has the x, y value in each entry
    const coordsArr = dataset.xs.map((val, index) => [
      val,
      dataset.ys[index],
    ]);

    // Determine if the line should be dashed or solid and in what way based
    // upon the color wrap around.
    const cssClassString = `line-${i} ${getLineClass(i)}`;

    svg.append('path')
      .datum(coordsArr)
      .attr('fill', 'none')
      .attr('class', cssClassString)
      .attr('stroke', colorGen(i))
      .attr('stroke-width', 1.5)
      .attr('d', d3.line()
        .x((data) => xScale(data[0]))
        .y((data) => yScale(data[1])));
    svg.append('path');
  });

  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);
  // For large numbers, set the format to 2 decimal places and scientific
  // notation
  if (!xlog) {
    xAxis = xAxis.tickFormat(d3.format('.2'));
  }
  if (!ylog) {
    yAxis = yAxis.tickFormat(d3.format('.2'));
  }

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
};
