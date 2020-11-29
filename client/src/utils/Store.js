import axios from 'axios';
import clonedeep from 'lodash.clonedeep';
import baseurl from '@/env';
import {
  set,
  keys,
  del,
  get,
} from 'idb-keyval';

axios.defaults.withCredentials = true;

/**
 * This store is initialized at the beginning of the application startup. It
 * should be able to be accessed with `this.$store` on any component.
 */
export default class API {
  constructor() {
    this.state = {
      plot: '',
      models: {},
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
  createPlot = async (fig_type = 'dndm') => {
    // may need to call createModel on all items before getting plot
    try {
      const { data } = await axios.post(`${baseurl}/plot`, {
        fig_type,
        img_type: 'png',
      });
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
   */
  createModel = async (model, name) => {
    try {
      await axios.post(`${baseurl}/create`, {
        params: this.flatten(model),
        label: name,
      });
      await Promise.all([this.setModel(name, model), this.createPlot()]);
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
      await Promise.all([this.setModel(name, model), this.createPlot()]);
    } catch (error) {
      console.error(error);
      // better error handling here, some vue event?
    }
  }

  /**
   * Clones a model
   * @param {String} oldName
   * @param {String} newName
   */
  cloneModel = async (oldName, newName) => {
    try {
      await axios.post(`${baseurl}/clone`, {
        model_name: oldName,
        new_model_name: newName,
      });
      const model = await this.getModel(oldName);
      await Promise.all([this.setModel(newName, model), this.createPlot()]);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Gets (clones) a model at label, keeps function pure.
   * @param {String} name the name of the model
   * @returns {Object | null} A copy of the target model, or null
   */
  getModel = async (name) => clonedeep(await this?.state.models[name]);

  /**
   * Sets a model at name
   * @param {String} name the name of the model
   * @param {Object} model the model to set
   */
  setModel = async (name, model) => {
    try {
      await set(name, model);
      this.state.models[name] = model;
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
   */
  deleteModel = async (name) => {
    try {
      await axios.post(`${baseurl}/delete`, {
        model_name: name,
      });
      await del(name);
      /* eslint-disable */
      delete this?.state.models[name];
      /* eslint-enable */
    } catch (error) {
      console.error(error);
    }
  }
}
