import axios from 'axios';
import clonedeep from 'lodash.clonedeep';
import baseurl from '@/env';
import Debug from 'debug';
import {
  set,
  keys,
  del,
  get,
  clear,
} from 'idb-keyval';

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
      models: {},
      modelNames: [],
      plot: {
        x: '',
        y: '',
        plotData: null,
      },
      error: false,
      errorType: '',
      errorMessage: '',
    };
  }

  /**
   * Initializes cache.
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
   * Gets the plot.
   *
   * @returns {String} plot base64 string
   */
  getPlot = () => this.plot;

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
   * Gets plot from server
   * @param {String} x, x axis type
   * @param {String} y, y axis type
   * @return {String} image data base64 string, or null if request fails
   */
  createPlot = async () => {
    // eslint-disable-next-line
    alert('Going to be updated in next merge');
    return null;
  }

  /**
   * Sends the model data to server to create Tracer Halo Model Object. This
   * also saves the model into the local indexed db on the client.
   *
   * @param {Object} model model data
   * @param {String} name model name
   */
  createModel = async (model, name) => {
    try {
      await axios.post(`${baseurl}/create`, {
        params: model,
        label: name,
      });
      this.state.error = false;
      await Promise.all([this.setModel(name, model), this.getPlotData()]);
    } catch (error) {
      console.error(error);
      this.state.error = true;
      console.log('ERROR OCCURRED');
      if (error.response) {
        this.state.errorMessage = error.response.data.description;
        this.state.errorType = (error.response.data.code >= 500) ? 'Server' : 'Model';
      }
    }
  }

  /**
   * Updates a model.
   *
   * @param {Object} model the updated model object
   * @param {String} name the name of the model to update
   */
  updateModel = async (name, model) => {
    try {
      await axios.post(`${baseurl}/update`, {
        params: model,
        model_name: name,
      });
      this.state.error = false;
      await Promise.all([this.setModel(name, model), this.getPlotData()]);
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
   * Renames a model.
   *
   * @param {String} oldName the original name of the model
   * @param {String} newName the new name of the model
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
   * Clones a model.
   *
   * @param {String} oldName
   * @param {String} newName
   */
  cloneModel = async (oldName, newName) => {
    try {
      await axios.post(`${baseurl}/clone`, {
        model_name: oldName,
        new_model_name: newName,
      });
      this.state.error = false;
      const model = await this.getModel(oldName);
      await Promise.all([this.setModel(newName, model), this.getPlotData()]);
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
   * @param {String} name the name of the model
   * @returns {Object | undefined} a copy of the target model, or undefined if
   * it doesn't exist
   */
  getModel = async (name) => clonedeep(await this?.state.models[name]);

  /**
   * Gets (clones) all models.
   *
   * @returns {{
   *  [modelName: string]: Object
   * } | undefined} A copy of all the models with their names or undefined
   */
  getAllModels = async () => {
    const modelNames = this.getModelNames();

    /* Pull all models out of state and process because they are stored as
    promises. */
    const modelPromises = modelNames.map((modelName) => this?.state.models[modelName]);
    const allModelObjs = clonedeep(await Promise.all(modelPromises));
    const allModels = {};
    modelNames.forEach((modelName, index) => {
      allModels[modelName] = allModelObjs[index];
    });
    return allModels;
  };

  /**
   * Sets a model with the given name.
   *
   * @param {String} name the name of the model
   * @param {Object} model the model to set
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
   * Deletes a model.
   *
   * @param {String} name the name of the model to delete
   */
  deleteModel = async (name) => {
    try {
      await axios.post(`${baseurl}/delete`, {
        model_name: name,
      });
      this.state.error = false;
      await del(name);
      /* eslint-disable */
      delete this?.state.models[name];
      this.state.modelNames = this.getModelNames();
      /* eslint-enable */
      await this.getPlotData();
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
   * Clears all existing models.
   */
  clearModels = async () => {
    try {
      await axios.post(`${baseurl}/clear`);
      await clear();
      this.state.models = {};
      this.state.modelNames = this.getModelNames();
      await this.getPlotData();
    } catch (error) {
      console.log(error);
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
      const data = await axios.post(`${baseurl}/get_plot_data`, {
        x: this.state.plot.x,
        y: this.state.plot.y,
      });
      this.state.plot.plotData = data.data;
      this.state.error = false;
    } catch (error) {
      console.error(error);
      this.state.error = true;
      if (error.response) {
        this.state.errorMessage = error.response.data.description;
        this.state.errorType = (error.response.data.code === 500) ? 'Server' : 'Model';
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
      if (refresh) await this.getPlotData();
    }
  }
}
