import axios from 'axios';
import clonedeep from 'lodash.clonedeep';
import baseurl from '@/env';
import IDB from './IDB';

axios.defaults.withCredentials = true;
export default class API {
  constructor() {
    this.models = {};
    this.keys = [];
    // future change: create new idb to store all plots
    this.plot = '';
    this.db = new IDB();
    this.init();
  }

  init = async () => {
    const [models, keys] = await Promise.all([
      this.db.getAll(),
      this.db.keys(),
    ]);
    this.models = models;
    this.keys = keys;
  }

  /**
   * Gets plot from server
   * @param {String} fig_type, type of figure to be requested from server
   * @return {String} image data base64 string, or null if request fails
   */
  createPlot = async (fig_type) => {
    // may need to call createModel on all items before getting plot
    try {
      const { data } = await axios.post(`${baseurl}/plot`, {
        fig_type,
        img_type: 'png',
      });
      this.plot = `data:image/png;base64,${data.figure}`;
    } catch (error) {
      console.error(error);
      // better error messaging here
    }
  }

  /**
   * Sends model data to server to create Tracer Halo Model Object
   * Also saves model into indexed db
   * @param {Object} model model data
   * @param {String} name model name
   */
  createModel = async (model, name) => {
    const params = {};
    Object.values(model).forEach((value) => {
      Object.assign(params, value);
    });
    try {
      await axios.post(`${baseurl}/create`, {
        params,
        label: name,
      });
      await Promise.all([this.setModel(model, name), this.createPlot()]);
    } catch (error) {
      console.error(error);
      // better error messaging here
    }
  }

  /**
   * Updates a model
   * @param {Object} model model to update
   * @param {String} label label to update model
   */
  updateModel = async (model, name) => {
    try {
      /* some api call here */
      await Promise.all([this.setModel(model, name), this.createPlot()]);
    } catch (error) {
      console.error(error);
      // better error handling here, some vue event?
    }
  }

  /**
   *
   * @param {*} model
   * @param {*} name
   */
  cloneModel = async (model, name) => {
    try {
      // unknown api call somewhere,
      // name may be old name for api call
      // use getModel to create the cloned model
      await Promise.all([this.setModel(model, name), this.createPlot()]);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Gets (clones) a model at label, keeps function pure.
   * @param {String} label
   * @returns {Object} A copy of the target model, or null
   */
  getModel = (name) => clonedeep(this.models[name])

  /**
   * gets all keys
   * @returns {Array<String>} keys
   */
  getKeys = () => this.keys

  /**
   * Sets a model at label
   * @param {Object} model the model object to set
   * @param {String} name the name to set the model
   */
  setModel = async (model, name) => {
    // puts model inside idb after successful api call
    await this.db.put(name, {
      name,
      model,
    });
    this.models[name] = model;
    this.keys = this.db.keys();
  }
}
