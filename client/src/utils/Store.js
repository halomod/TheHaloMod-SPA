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
      error: false,
      errorType: '',
      errorMessage: '',
      plotTypes: [],
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
    this.state.plotTypes = await this.getPlotTypes();
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
   * gets the plot
   * @returns {String} plot base64 string
   */
  getPlot = () => this.plot;

  /**
   * Gets the different plot types.
   *
   * @returns {string[]} the array of plot types
   */
  getPlotTypes = async () => {
    const result = await axios.get(`${baseurl}/get_plot_types`);
    const plotTypes = result.data;
    return Object.keys(plotTypes);
  }

  /**
   * Gets plot from server
   * @param {String} fig_type, type of figure to be requested from server
   * @return {String} image data base64 string, or null if request fails
   */
  createPlot = async (fig_type = this.state.plotType) => {
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
      this.state.error = false;
      await Promise.all([this.setModel(name, model), this.getPlotData()]);
    } catch (error) {
      console.error(error);
      this.state.error = true;
      if (error.response) {
        this.state.errorMessage = error.response.data.description;
        this.state.errorType = (error.response.data.code >= 500) ? 'Server' : 'Model';
      }
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
   * Gets (clones) a model at label, keeps function pure.
   * @param {String} name the name of the model
   * @returns {Object | undefined} A copy of the target model, or undefined
   */
  getModel = async (name) => clonedeep(await this?.state.models[name]);

  /**
   * Gets (clones) all models.
   *
   * @returns {{
   *  [modelName: String]: Object
   * } | undefined} A copy of all the models with their names or undefined
   */
  getModels = async () => {
    const modelNames = this.getModelNames();
    const modelPromises = modelNames.map((modelName) => this?.state.models[modelName]);
    const allModelObjs = clonedeep(await Promise.all(modelPromises));
    const allModels = {};
    modelNames.forEach((modelName, index) => {
      allModels[modelName] = allModelObjs[index];
    });
    return allModels;
  };

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
   * Clears all existing models
   * @returns {void}
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
   * Retrieves plot data for all models
   *
   * @returns {void}
   */
  getPlotData = async () => {
    let data = {};
    try {
      data = await axios.post(`${baseurl}/get_plot_data`, {
        fig_type: this.state.plotType,
      });
      this.state.plotData = data.data;
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
