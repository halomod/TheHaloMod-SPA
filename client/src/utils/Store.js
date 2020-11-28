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
export default class API {
  constructor() {
    this.plot = '';
    this.init();
  }

  /**
   * initializes cache
   */
  init = async () => {
    const k = await keys();
    this.models = new Map();
    k.forEach((key) => {
      this.models.set(key, get(key));
    });
    await Promise.all(this.models);
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
      this.plot = `data:image/png;base64,${data.figure}`;
      return this.plot;
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
   * clones a model
   * @param {String} oldName
   * @param {String} newName
   */
  cloneModel = async (oldName, newName) => {
    try {
      await axios.post(`${baseurl}/clone`, {
        model_name: oldName,
        new_model_name: newName,
      });
      console.time('test');
      const model = await this.getModel(oldName);
      console.timeEnd('test');
      await Promise.all([this.setModel(newName, model), this.createPlot()]);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Gets (clones) a model at label, keeps function pure.
   * @param {String} name the name of the model
   * @returns {Object} A copy of the target model, or null
   */
  getModel = async (name) => clonedeep(await this.models.get(name));

  /**
   * Sets a model at name
   * @param {String} name the name of the model
   * @param {Object} model the model to set
   */
  setModel = async (name, model) => {
    try {
      await set(name, model);
      this.models.set(name, model);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Gets all keys
   * @returns {MapIterator} list of keys
   */
  getKeys = () => this?.models?.keys();

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
      this.models.delete(name);
    } catch (error) {
      console.error(error);
    }
  }
}
