import axios from 'axios';
import clonedeep from 'lodash.clonedeep';
import baseurl from '@/env';
import Debug from 'debug';
import {
  set,
  keys,
  del,
  get,
} from 'idb-keyval';

axios.defaults.withCredentials = true;

const debug = Debug('Store.js');
debug.enabled = false;

/**
 * This store is initialized at the beginning of the application startup. It
 * should be able to be accessed with `this.$store` on any component.
 */
export default class API {
  constructor() {
    this.state = {
      plot: '',
      models: {},
      modelNames: [],
      plotType: 'dndm',
      plotData: null,
      plotDetails: {
        scale: '',
        xLabel: '',
        yLabel: '',
      },
    };
  }

  /**
   * initializes cache
   */
  init = async () => {
    const k = await keys();
    const models = new Map();
    k.forEach((key) => {
      const obj = get(key);
      models.set(key, obj);
    });
    await Promise.all(models);

    this.state.models = Object.fromEntries(models);
    this.state.modelNames = this.getModelNames();
    this.getPlotData();
  }

  /**
   * Flattens model to make request params
   * @param {Object} model model to flatten
   * @returns {Object} flattened params
   */
  flatten = (model) => {
    const params = {};
    Object.values(model).forEach((value) => {
      Object.assign(params, value);
    });
    return params;
  }

  /**
   * Gets plot from server
   * @param {String} fig_type, type of figure to be requested from server
   * @return {String} image data base64 string, or null if request fails
   */
  createPlot = async (fig_type = this.state.plotType) => {
    // may need to call createModel on all items before getting plot
    try {
      const { data } = await axios.post(`${baseurl}/plot`, {
        fig_type,
        img_type: 'png',
      });
      debug(`The data was retrieved with the baseurl of ${baseurl} and is: `,
        data);
      this.state.plot = `data:image/png;base64,${data.figure}`;
      return this.state.plot;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * gets the plot
   * @returns {String} plot base64 string
   */
  getPlot = () => this.plot;

  /**
   * Sends model data to server to create Tracer Halo Model Object
   * Also saves model into indexed db
   * @param {Object} model model data
   * @param {String} name model name
   * @returns {void}
   */
  createModel = async (model, name) => {
    try {
      await axios.post(`${baseurl}/create`, {
        params: this.flatten(model),
        label: name,
      });
      await Promise.all([this.setModel(name, model), this.getPlotData()]);
    } catch (error) {
      console.error(error);
      // better error messaging here
    }
  }

  /**
   * Updates a model
   * @param {Object} model model to update
   * @param {String} name label to update model
   */
  updateModel = async (name, model) => {
    try {
      await axios.post(`${baseurl}/update`, {
        params: this.flatten(model),
        model_name: name,
      });
      await Promise.all([this.setModel(name, model), this.getPlotData()]);
    } catch (error) {
      console.error(error);
      // better error handling here, some vue event?
    }
  }

  /** Renames a model
   *
   * @param {String} oldName
   * @param {String} newName
   */
  renameModel = async (oldName, newName) => {
    try {
      await axios.post(`${baseurl}/rename`, {
        model_name: oldName,
        new_model_name: newName,
      });
      const model = this.state.models[oldName];
      await Promise.all([
        set(newName, model),
        del(oldName),
      ]);
      this.state.models[newName] = model;
      delete this.state.models[oldName];
      this.state.modelNames = this.getModelNames();
      this.getPlotData();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Clones a model
   * @param {String} oldName
   * @param {String} newName
   * @returns {void}
   */
  cloneModel = async (oldName, newName) => {
    try {
      await axios.post(`${baseurl}/clone`, {
        model_name: oldName,
        new_model_name: newName,
      });
      const model = await this.getModel(oldName);
      await Promise.all([this.setModel(newName, model), this.getPlotData()]);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Gets (clones) a model at label, keeps function pure.
   * @param {String} name the name of the model
   * @returns {Object | undefined} A copy of the target model, or undefined
   */
  getModel = async (name) => clonedeep(await this?.state.models[name]);

  /**
   * Sets a model at name
   * @param {String} name the name of the model
   * @param {Object} model the model to set
   * @returns {void}
   */
  setModel = async (name, model) => {
    try {
      await set(name, model);
      this.state.models[name] = model;
      this.state.modelNames = this.getModelNames();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Gets all of the model names.
   *
   * @returns {string[]} array of the model names
   */
  getModelNames = () => Object.keys(this.state.models);

  /**
   * deletes a model
   * @param {String} name the name to set the model
   * @returns {void}
   */
  deleteModel = async (name) => {
    try {
      await axios.post(`${baseurl}/delete`, {
        model_name: name,
      });
      await del(name);
      /* eslint-disable */
      delete this?.state.models[name];
      this.state.modelNames = this.getModelNames();
      /* eslint-enable */
      await this.getPlotData();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Retrieves plot data for specified models, or all models
   */
  getPlotData = async () => {
    let data = {};
    try {
      data = await axios.post(`${baseurl}/get_plot_data`, {
        fig_type: this.state.plotType,
      });
      this.mapToChartData(data.data);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Maps the plot data returned from the POST request to /get_plot_data
   * to the format of the chartData prop in Chart.Vue:
   * chartData {
   *  datasets: [{
   *    label: <dataset/model label>,
   *    data: [
   *      x:<x value>
   *      y: <y value>
   *    ]
   *  }]
   * }
   * @param {Object} data the plot data returned from the body of the
   * POST request to /get_plot_data
   */
  mapToChartData = (data) => {
    const scale = (data.plot_details.yscale === 'log') ? 'logarithmic'
      : data.plot_details.yscale;
    this.state.plotDetails.scale = scale;
    this.state.plotDetails.xLabel = data.plot_details.xlab;
    this.state.plotDetails.yLabel = data.plot_details.ylab;
    const chartdata = {};
    chartdata.datasets = [];
    Object.keys(data.plot_data).forEach((model_name, model_idx) => {
      chartdata.datasets[model_idx] = {};
      chartdata.datasets[model_idx].label = model_name;
      chartdata.datasets[model_idx].data = [];
      data.plot_data[model_name].xs.forEach((x, point_idx) => {
        chartdata.datasets[model_idx].data[point_idx] = {};
        chartdata.datasets[model_idx].data[point_idx].x = x;
        chartdata.datasets[model_idx].data[point_idx].y = data.plot_data[model_name].ys[point_idx];
      });
    });
    this.state.plotData = chartdata;
  }

  /**
   * Sets the plot type for the plot, and generates a new plot if it is
   * different.
   *
   * @param {string} newPlotType the identifier of the new plot type. For
   * example: `dndm`.
   * @returns {void}
   */
  setPlotType = async (newPlotType) => {
    if (newPlotType !== this.state.plotType) {
      this.state.plotType = newPlotType;
      await this.getPlotData();
    }
  }
}
