import axios from 'axios';
import baseurl from '@/env';
import IDB from './IDB';

axios.defaults.withCredentials = true;
export default class API {
  db = new IDB();

  /**
   * Gets plot from server
   * @param {String} fig_type, type of figure to be requested from server
   * @return {String} image data base64 string, or null if request fails
   */
  getPlot = async (fig_type) => {
    try {
      const { data } = await axios.post(`${baseurl}/plot`, {
        fig_type,
        img_type: 'png',
      });
      return `data:image/png;base64,${data.figure}`;
    } catch (error) {
      console.error(error);
      return null;
      // better error messaging here
    }
  }

  /**
   * Sends model data to server to create Tracer Halo Model Object
   * Also saves model into indexed db
   * @param {Object} model model data
   * @param {String} label model name
   */
  createObject = async (model, label) => {
    const params = {};
    Object.values(model).forEach((value) => {
      Object.assign(params, value);
    });
    try {
      await axios.post(`${baseurl}/create`, {
        params,
        label,
      });

      // puts model inside idb after successful api call
      await this.db.put(label, {
        name: label,
        model,
      });
    } catch (error) {
      console.error(error);
      // better error messaging here
    }
  }
}
