import axios from 'axios';
import JSZip from 'jszip';
import unzip from 'lodash.unzip';
import baseUrl from '@/env';
import PLOT_AXIS_OPTIONS from '@/constants/PLOT_AXIS_OPIONS.json';
import PLOT_AXIS_METADATA from '@/constants/PLOT_AXIS_METADATA.json';
import * as d3 from 'd3';

/**
 * Adds inline CSS styles to the D3 SVG element by extracting
 * style properties using Window.getComputedStyles.
 *
 * @param {Array} elements array of elements and style properties
 */
function addInlineCSS(elements) {
  if (elements && elements.length) {
    elements.forEach((d) => {
      // eslint-disable-next-line
      d3.selectAll(d.el).each(function () {
        const element = this;
        if (d.properties && d.properties.length) {
          d.properties.forEach((prop) => {
            const computedStyle = getComputedStyle(element, null);
            const value = computedStyle.getPropertyValue(prop);
            element.style[prop] = value;
          });
        }
      });
    });
  }
}

export async function downloadData() {
  const zip = new JSZip();

  /* eslint-disable */
  for (const [kind, options] of Object.entries(PLOT_AXIS_OPTIONS)) {
    /* Gets relevant fields from constants files */
    let params = [kind, ...options.y];
    if (kind === "m") params = params.filter(value => value !== "how_big");
    const labels = params.map(param => PLOT_AXIS_METADATA[param].label);

    /* API request */
    const response = await axios.post(`${baseUrl}/get_object_data`, {
      param_names: params
    });
    const json = response.data;

    /* Construct CSV */
    Object.entries(json).forEach(([name, parameters]) => {
      const data = unzip(Object.values(parameters));
      const csv = `${labels.join("\t")}\n${data.map(row => `${row.join("\t")}\n`).join()}`;
      zip.file(`${name}_${kind}_vector.csv`, csv);
    });
  }
  /* eslint-enable */

  const blob = await zip.generateAsync({ type: 'blob' });
  return window.URL.createObjectURL(blob);
}

export async function downloadPlotImage() {
  const svgElements = [
    { el: '.graph-line', properties: ['fill', 'stroke', 'stroke-width'] },
    {
      el: '.grid line',
      properties: ['stroke', 'stroke-opacity', 'shape-rendering'],
    },
    { el: '.grid path', properties: ['stroke-width'] },
    { el: '.axis-label g text', properties: ['font-size', 'font-family'] },
  ];
  addInlineCSS(svgElements);
  const svgNode = document.getElementById('svg-plot');
  const serializer = new XMLSerializer();
  let plotString = serializer.serializeToString(svgNode);
  if (!plotString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    plotString = plotString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!plotString.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
    plotString = plotString.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }
  plotString = `<?xml version="1.0" standalone="no"?>\r\n${plotString}`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(plotString)}`;
}

export async function downloadParamValsJson(store) {
  const modelsJsonString = JSON.stringify(await store.getAllModels(), null, 2);
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(modelsJsonString)}`;
  return dataStr;
}

export function downloadParamValsToml() {
  return `${baseUrl}/toml`;
}
