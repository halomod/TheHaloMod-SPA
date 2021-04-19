import axios from 'axios';
import clonedeep from 'lodash.clonedeep';
import baseurl from '@/env';
import Debug from 'debug';
import {
  set,
  keys,
  get,
  del,
} from 'idb-keyval';
import { DEFAULT_THEME } from '@/constants/themeOptions';
import PLOT_AXIS_METADATA from '@/constants/PLOT_AXIS_METADATA.json';

axios.defaults.withCredentials = true;

const debug = Debug('Store.js');
debug.enabled = false;

/**
 * This store is initialized at the beginning of the application startup. It
 * should be able to be accessed with `this.$store` on any component.
 */
export default class Store {
  constructor() {
    this.state = {
      /**
       * Stored as a map so that it retains insertion order.
       */
      models: new Map(),
      modelNames: [],
      plot: {
        x: '',
        y: '',
        plotData: null,
        plotLogSettings: clonedeep(PLOT_AXIS_METADATA),
        logx: true,
        logy: true,
      },
      error: false,
      errorType: '',
      errorMessage: '',
      theme: DEFAULT_THEME,
    };
  }

  /**
   * Initializes cache.
   */
  init = async () => {
    const k = await keys();

    // If the models object does not exist, create it.
    if (!k.includes('models')) {
      await set('models', new Map());
    } else {
      this.state.models = await get('models');
    }

    // If the theme value does not exist, create it.
    if (!k.includes('theme')) {
      await set('theme', DEFAULT_THEME);
    } else {
      this.state.theme = await get('theme');
    }

    // If the plot information does not exist, create it.
    if (!k.includes('plot')) {
      await set('plot', this.state.plot);
    } else {
      this.state.plot = await get('plot');
    }

    this.state.modelNames = this.getModelNames();
    if (this.state.models.size !== 0) {
      this.getPlotData();
    }
  }

  /**
   * The way that data is formatted for each plot option.
   *
   * @typedef PlotDetails
   * @type {{
   *  xlab: string,
   *  ylab: string,
   *  yScale: string
   * }}
   */

  /**
   * Flattens the model object to prepare it for use by the server
   *
   * @param {object} model
   */
  flatten = (model) => {
    let flattened = {};
    Object.values(model).forEach((subform) => {
      flattened = { ...flattened, ...subform };
    });
    return flattened;
  }

  /**
   * Sends the model data to server to create Tracer Halo Model Object. This
   * also saves the model into the local indexed db on the client.
   *
   * @param {object} model model data
   * @param {string} name model name
   */
  createModel = async (model, name) => {
    try {
      await axios.post(`${baseurl}/model`, {
        params: this.flatten(model),
        label: name,
      });
      this.state.error = false;
      await Promise.all([
        this.setModel(name, model),
        this.getPlotData(),
      ]);
      this.state.modelNames = this.getModelNames();
    } catch (error) {
      console.error(error);
      this.state.error = true;
      console.error('ERROR OCCURED');
      if (error.response) {
        const desc = (JSON.parse(error.response.data.data).description)[0];
        const [simpleDescription, ...stkTrace] = desc;
        this.state.errorMessage = simpleDescription;
        this.state.errorType = (error.response.data.code >= 500) ? 'Server' : 'Model';
        //console.error(stkTrace.join());
      } else {
        const msg = 'The server did not respond. Please check your internet connection.';
        this.state.errorMessage = msg;
        this.state.errorType = 'Server';
        console.error(`Server Error: ${msg}`);
      }
    }
  }

  /**
   * Updates a model.
   *
   * @param {object} model the updated model object
   * @param {string} name the name of the model to update
   */
  updateModel = async (name, model) => {
    try {
      await axios.put(`${baseurl}/model`, {
        params: this.flatten(model),
        model_name: name,
      });
      this.state.error = false;
      await Promise.all([this.setModel(name, model), this.getPlotData()]);
    } catch (error) {
      console.error(error);
      this.state.error = true;
      console.error('ERROR OCCURED');
      if (error.response) {
        const desc = (JSON.parse(error.response.data.data).description)[0];
        const [simpleDescription, ...stkTrace] = desc;
        this.state.errorMessage = simpleDescription;
        this.state.errorType = (error.response.data.code >= 500) ? 'Server' : 'Model';
        //console.error(stkTrace.join());
      } else {
        const msg = 'The server did not respond. Please check your internet connection.';
        this.state.errorMessage = msg;
        this.state.errorType = 'Server';
        console.error(`Server Error: ${msg}`);
      }
    }
  }

  /**
   * Renames a model.
   *
   * @param {string} oldName the original name of the model
   * @param {string} newName the new name of the model
   */
  renameModel = async (oldName, newName) => {
    try {
      await axios.patch(`${baseurl}/model`, {
        model_name: oldName,
        new_model_name: newName,
      });
      const model = this.state.models.get(oldName);
      this.state.models.set(newName, model);
      this.state.models.delete(oldName);
      this.state.modelNames = this.getModelNames();
      await set('models', this.state.models);
      this.getPlotData();
    } catch (error) {
      console.error(error);
      this.state.error = true;
      console.error('ERROR OCCURED');
      if (error.response) {
        const desc = (JSON.parse(error.response.data.data).description)[0];
        const [simpleDescription, ...stkTrace] = desc;
        this.state.errorMessage = simpleDescription;
        this.state.errorType = (error.response.data.code >= 500) ? 'Server' : 'Model';
        //console.error(stkTrace.join());
      } else {
        const msg = 'The server did not respond. Please check your internet connection.';
        this.state.errorMessage = msg;
        this.state.errorType = 'Server';
        console.error(`Server Error: ${msg}`);
      }
    }
  }

  /**
   * Clones a model.
   *
   * @param {string} oldName
   * @param {string} newName
   */
  cloneModel = async (oldName, newName) => {
    try {
      await axios.put(`${baseurl}/models`, {
        model_name: oldName,
        new_model_name: newName,
      });
      this.state.error = false;
      const model = await this.getModel(oldName);
      await Promise.all([this.setModel(newName, model), this.getPlotData()]);
    } catch (error) {
      console.error(error);
      this.state.error = true;
      console.error('ERROR OCCURED');
      if (error.response) {
        const desc = (JSON.parse(error.response.data.data).description)[0];
        const [simpleDescription, ...stkTrace] = desc;
        this.state.errorMessage = simpleDescription;
        this.state.errorType = (error.response.data.code >= 500) ? 'Server' : 'Model';
        //console.error(stkTrace.join());
      } else {
        const msg = 'The server did not respond. Please check your internet connection.';
        this.state.errorMessage = msg;
        this.state.errorType = 'Server';
        console.error(`Server Error: ${msg}`);
      }
    }
  }

  /**
   * Sets an erorr for the application. This becomes visible to the user.
   *
   * @param {string} errorType the type of error
   * @param {string} errorMessage the message for the error
   */
  setError = (errorType, errorMessage) => {
    this.state.error = true;
    this.state.errorType = errorType;
    this.state.errorMessage = errorMessage;
  }

  /**
   * Gets (clones) a model with the given name. This returns a deep cloned
   * copy of the model.
   *
   * @param {string} name the name of the model
   * @returns {object | undefined} a copy of the target model, or undefined if
   * it doesn't exist
   */
  getModel = (name) => clonedeep(this.state.models.get(name));

  /**
   * Gets (clones) all models.
   *
   * @returns {{
   *  [modelName: string]: Object
   * } | undefined} A copy of all the models with their names or undefined
   */
  getAllModels = () => clonedeep(Object.fromEntries(this.state.models.entries()));

  /**
   * Sets a model with the given name.
   *
   * @param {string} name the name of the model
   * @param {object} model the model to set
   */
  setModel = async (name, model) => {
    this.state.models.set(name, model);
    this.state.modelNames = this.getModelNames();
    await set('models', this.state.models);
  }

  /**
   * Gets all of the model names.
   *
   * @returns {string[]} array of the model names
   */
  getModelNames = () => Array.from(this.state.models.keys());

  /**
   * Deletes a model.
   *
   * @param {string} name the name of the model to delete
   */
  deleteModel = async (name) => {
    try {
      await axios.delete(`${baseurl}/model`, {
        data: {
          model_name: name,
        },
      });
      this.state.error = false;
      this.state.models.delete(name);
      this.state.modelNames = this.getModelNames();
      await set('models', this.state.models);
      await this.getPlotData();
    } catch (error) {
      console.error(error);
      this.state.error = true;
      console.error('ERROR OCCURED');
      if (error.response) {
        const desc = (JSON.parse(error.response.data.data).description)[0];
        const [simpleDescription, ...stkTrace] = desc;
        this.state.errorMessage = simpleDescription;
        this.state.errorType = (error.response.data.code >= 500) ? 'Server' : 'Model';
        //console.error(stkTrace.join());
      } else {
        const msg = 'The server did not respond. Please check your internet connection.';
        this.state.errorMessage = msg;
        this.state.errorType = 'Server';
        console.error(`Server Error: ${msg}`);
      }
    }
  }

  /**
   * Clears all existing models.
   */
  clearModels = async () => {
    try {
      await axios.delete(`${baseurl}/models`);
      await del('models');
      this.state.models = new Map();
      this.state.modelNames = this.getModelNames();
      await this.getPlotData();
    } catch (error) {
      console.error(error);
      this.state.error = true;
      console.error('ERROR OCCURED');
      if (error.response) {
        const desc = (JSON.parse(error.response.data.data).description)[0];
        const [simpleDescription, ...stkTrace] = desc;
        this.state.errorMessage = simpleDescription;
        this.state.errorType = (error.response.data.code >= 500) ? 'Server' : 'Model';
        //console.error(stkTrace.join());
      } else {
        const msg = 'The server did not respond. Please check your internet connection.';
        this.state.errorMessage = msg;
        this.state.errorType = 'Server';
        console.error(`Server Error: ${msg}`);
      }
    }
  }

  /**
   * Retrieves plot data for all models if a plotType is specified in state.
   * This doesn't return the plot data, rather it sets the plot data to the
   * `state` of this `Store` object.
   */
  getPlotData = async () => {
    if (this.state.plot.y === '' || this.state.plot.x === '') {
      return;
    }
    try {
      const data = await axios.get(`${baseurl}/plot`, {
        params: {
          x: this.state.plot.x,
          y: this.state.plot.y,
        },
      });
      this.state.plot.plotData = data.data;
      this.state.error = false;
    } catch (error) {
      console.error(error);
      this.state.error = true;
      console.error('ERROR OCCURED');
      if (error.response) {
        const desc = (JSON.parse(error.response.data.data).description)[0];
        const [simpleDescription, ...stkTrace] = desc;
        this.state.errorMessage = simpleDescription;
        this.state.errorType = (error.response.data.code >= 500) ? 'Server' : 'Model';
        //console.error(stkTrace.join());
      } else {
        const msg = 'The server did not respond. Please check your internet connection.';
        this.state.errorMessage = msg;
        this.state.errorType = 'Server';
        console.error(`Server Error: ${msg}`);
      }
    }
  }

  /**
   * Sets the plot type for the plot, and generates a new plot if it is
   * different.
   *
   * @param {string} plotType the identifier of the new plot type. For
   * example: `dndm`.
   * @param {string} axis the axis to change. For example: `x`.
   * @param {boolean} refresh if true, gets new plot data
   * @returns {void}
   */
  setPlotType = async (plotType, axis, refresh) => {
    if (plotType !== this.state.plot[axis]) {
      this.state.plot[axis] = plotType;

      // Update the logarithmic value for this new axis
      const plotLogSetting = this.state.plot.plotLogSettings[this.state.plot[axis]];
      if (plotLogSetting) {
        this.state.plot[`log${axis}`] = plotLogSetting.scale === 'log';
      }

      if (refresh) await this.getPlotData();
      await set('plot', this.state.plot);
    }
  }

  /**
   * Sets the scale of the chosen axis of the plot to either logarithmic
   * or linear.
   *
   * @param {'x' | 'y'} axis the axis to set, either x or y
   * @param {boolean} isLog true if it should be logarithmic
   */
  setPlotAxisScale = async (axis, isLog) => {
    this.state.plot[`log${axis}`] = isLog;
    if (isLog) {
      this.state.plot.plotLogSettings[this.state.plot[axis]].scale = 'log';
    } else {
      this.state.plot.plotLogSettings[this.state.plot[axis]].scale = 'linear';
    }
    await set('plot', this.state.plot);
  }

  /**
   * Updates the theme for the application and saves it to the store.
   *
   * @param {string} newTheme should be one of the constants exported from
   * `@/constants/themeOptions.js`
   * @param {Vue} vueInstance the instance of Vue for the application. This
   * can be simply passed as `this` if called in a component.
   */
  async setTheme(newTheme, vueInstance) {
    const vue = vueInstance;
    this.state.theme = newTheme;
    vue.$theme = newTheme;
    vue.$material.theming.theme = newTheme;
    await set('theme', newTheme);
  }
}
