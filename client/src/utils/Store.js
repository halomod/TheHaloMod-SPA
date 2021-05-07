import axios from 'axios';
import axiosRetry from 'axios-retry';
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
import forms from '@/constants/forms';
import * as Sentry from '@sentry/vue';

axios.defaults.withCredentials = true;
axiosRetry(axios, {
  retries: 3,
  shouldResetTimeout: true,
  retryDelay: axiosRetry.exponentialDelay, // Exponential back-off retry delay between requests
  // retryCondition: () => true, // retry no matter what
  // If true it will retry
  retryCondition: (error) => {
    if (error.response) {
      return (error.response.status !== 500 && error.response.status > 299);
    }
    // Always retry if no server response
    return true;
  },
});

const debug = Debug('Store.js');
debug.enabled = false;

/**
 * This store is initialized at the beginning of the application startup. It
 * should be able to be accessed with `this.$store` on any component.
 */
export default class Store {
  constructor() {
    /**
     * The top level state stored for the application and generally persisted
     * through restarts in the browser as long as the cache is maintained.
     */
    this.state = {
      /**
       * Stored as a map so that it retains insertion order.
       */
      models: new Map(),
      modelNames: [],
      /**
       * The data for the plot in the store. Holds all info including settings
       * for different plot types.
       */
      plot: {
        x: '',
        y: '',
        plotData: null,
        plotLogSettings: clonedeep(PLOT_AXIS_METADATA),
        logx: true,
        logy: true,
      },
      error: false,
      graphError: false,
      errorType: '',
      errorMessage: '',
      errorTrace: '',
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
   * Flattens the model object to prepare it for use by the server.
   *
   * @param {object} model
   */
  flatten = (model) => {
    let flattened = {};
    Object.values(model).forEach((subform) => {
      flattened = { ...flattened, ...subform };
    });

    // Convert null string to null value for specific models
    if (flattened[forms.tracer_concentration.modelKey] === 'null') {
      flattened[forms.tracer_concentration.modelKey] = null;
    }
    if (flattened[forms.tracer_profile.modelKey] === 'null') {
      flattened[forms.tracer_profile.modelKey] = null;
    }

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
        timeout: 3000,
      });
      this.state.error = false;
      await Promise.all([
        this.setModel(name, model),
        this.getPlotData(),
      ]);
      this.state.modelNames = this.getModelNames();
    } catch (error) {
      this.setError(error);
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
        timeout: 3000,
      });
      this.state.error = false;
      await Promise.all([this.setModel(name, model), this.getPlotData()]);
    } catch (error) {
      this.setError(error);
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
        timeout: 3000,
      });
      const model = this.state.models.get(oldName);
      this.state.models.set(newName, model);
      this.state.models.delete(oldName);
      this.state.modelNames = this.getModelNames();
      await set('models', this.state.models);
      this.getPlotData();
    } catch (error) {
      this.setError(error);
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
        timeout: 3000,
      });
      this.state.error = false;
      const model = await this.getModel(oldName);
      await Promise.all([this.setModel(newName, model), this.getPlotData()]);
    } catch (error) {
      this.setError(error);
    }
  }

  /**
   * Sets an erorr for the application. This becomes visible to the user.
   *
   * @param {Error} error the error to set
   */
  setError = (error) => {
    try {
      this.state.error = true;
      console.log('ERROR OCCURED');
      if (error.response) {
        const desc = (JSON.parse(error.response.data.data).description);
        let simpleDescription;
        let stkTrace;
        if (typeof desc !== 'string') {
          [simpleDescription, ...stkTrace] = desc;
        } else {
          simpleDescription = desc;
          stkTrace = null;
          console.log(simpleDescription);
        }
        this.state.errorMessage = simpleDescription;
        this.state.errorType = (error.response.data.code >= 500) ? 'Server' : 'Model';
        this.state.errorTrace = stkTrace.join();
        // Printing the stack trace to the console sends it to Sentry
        if (process.env.VUE_APP_SENTRY_ON !== 'FALSE') {
          console.log(stkTrace);
          // Sentry.captureMessage(simpleDescription);
          const scope = new Sentry.Scope();
          scope.setTag('ErrorCode', error.code);
          scope.setContext('Store Model State', this.state);
          scope.setContext('Error Object', error);
          const e = new Error(simpleDescription);
          e.name = error.message;
          Sentry.captureException(e, scope);
        }
      } else {
        const scope = new Sentry.Scope();
        scope.setTag('ErrorCode', error.code);
        // All the errors that do not have a response
        if (error.code === 'ECONNABORTED') {
          const msg = 'Communication with the server timed-out. Please check your internet connection.';
          this.state.errorMessage = msg;
          scope.setTag('ErrorCode', 'Connection Aborted');
          scope.setLevel('warning');
        } else if (error.code === 400) {
          const msg = 'The server did not respond correctly.';
          this.state.errorMessage = msg;
        } else if (typeof error.code === 'undefined') {
          const msg = 'The server did not respond after 3 attempts, it may be offline.';
          this.state.errorMessage = msg;
          scope.setTag('ErrorCode', 'Null');
          scope.setLevel('fatal');
        } else {
          const msg = `An unkown error occured tring to reach the server: ${error.code}`;
          this.state.errorMessage = msg;
        }
        this.state.errorType = 'Server';
        console.log(error.message);
        console.log(`Server Error: ${this.state.errorMessage}`);
        scope.setContext('Store Model State', this.state);
        scope.setContext('Error Object', error);
        const e = new Error(this.state.errorMessage);
        e.name = error.message;
        Sentry.captureException(e, scope);
      }
    } catch (e) {
      const msg = 'An error occured while handling an error. The server admin has been notified.';
      this.state.error = true;
      this.state.errorType = 'Client';
      this.state.errorMessage = msg;
      Sentry.captureException(e, 'fatal');
    }
  }

  /** Reports a bug associated with a particular model
   *
   * @param {string} modelName the name of the model reported
   * @param {string} bugDetails the details of the bug submitted by the user
  */
  reportBug = async (modelName, bugDetails) => {
    try {
      await axios.post(`${baseurl}/bugs`, {
        model_name: modelName,
        bug_details: bugDetails,
        timeout: 3000,
      });
    } catch (error) {
      console.error(error);
      this.state.error = true;
      if (error.response) {
        this.state.errorMessage = error.response.data.description;
        this.state.errorType = (error.response.data.code >= 500) ? 'Server' : 'Model';
      }
    }
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
        timeout: 3000,
      });
      this.state.error = false;
      this.state.models.delete(name);
      this.state.modelNames = this.getModelNames();
      await set('models', this.state.models);
      await this.getPlotData();
    } catch (error) {
      this.setError(error);
    }
  }

  /**
   * Clears all existing models.
   */
  clearModels = async () => {
    try {
      await axios.delete(`${baseurl}/models`, {
        timeout: 3000,
      });
      await del('models');
      this.state.models = new Map();
      this.state.modelNames = this.getModelNames();
      await this.getPlotData();
    } catch (error) {
      this.setError(error);
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
        timeout: 3000,
      });
      this.state.plot.plotData = data.data;
      this.state.error = false;
    } catch (error) {
      this.state.graphError = true;
      this.setError(error);
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
   * @returns {Promise<object>} the cloned, updated plot object on the store's
   * state
   */
  setPlotType = async (plotType, axis, refresh) => {
    debug(`setPlotType triggered for ${axis} axis with ${plotType} plotType`);
    if (plotType !== this.state.plot[axis]) {
      this.state.plot[axis] = plotType;

      // Update the logarithmic value for this new axis
      const plotLogSetting = this.state.plot.plotLogSettings[this.state.plot[axis]];
      if (plotLogSetting) {
        this.state.plot[`log${axis}`] = plotLogSetting.scale === 'log';
      }

      if (refresh) {
        await this.getPlotData();
      }
      await set('plot', this.state.plot);
    }
    return clonedeep(this.state.plot);
  }

  /**
   * Sets the plot type for both the x and y axis, then gets new plot data. If
   * only one plot type needs to be changed, use `setPlotType`.
   *
   * @param {string} xAxisPlotType
   * @param {string} yAxisPlotType
   * @returns {Promise<object>} the cloned, updated plot object on the store's
   * state
   */
  setBothPlotType = async (xAxisPlotType, yAxisPlotType) => {
    this.state.plot.x = xAxisPlotType;
    this.state.plot.y = yAxisPlotType;

    // Update the logarithmic value for the new axis
    const xPlotLogSetting = this.state.plot.plotLogSettings[this.state.plot.x];
    if (xPlotLogSetting) {
      this.state.plot.logx = xPlotLogSetting.scale === 'log';
    }
    const yPlotLogSetting = this.state.plot.plotLogSettings[this.state.plot.y];
    if (yPlotLogSetting) {
      this.state.plot.logy = yPlotLogSetting.scale === 'log';
    }
    await this.getPlotData();
    await set('plot', this.state.plot);
    return clonedeep(this.state.plot);
  }

  /**
   * Sets the scale of the chosen axis of the plot to either logarithmic
   * or linear.
   *
   * @param {'x' | 'y'} axis the axis to set, either x or y
   * @param {boolean} isLog true if it should be logarithmic
   * @returns {Promise<object>} the cloned, updated plot object on the store's
   * state
   */
  setPlotAxisScale = async (axis, isLog) => {
    this.state.plot[`log${axis}`] = isLog;
    if (isLog) {
      this.state.plot.plotLogSettings[this.state.plot[axis]].scale = 'log';
    } else {
      this.state.plot.plotLogSettings[this.state.plot[axis]].scale = 'linear';
    }
    await set('plot', this.state.plot);
    return clonedeep(this.state.plot);
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
