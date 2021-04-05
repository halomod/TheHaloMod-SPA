import { createServer, Model } from 'miragejs';
import baseurl from '@/env';
// import { schemeAccent } from 'd3';
import plotData from './example_data/plotData.json';
import plotTypes from './example_data/plotTypes.json';

/**
 * Creates a mock server for use in tests on the front-end.
 *
 * @param {string} environment this can be `test` for a test environment
 */
export default function makeServer(environment) {
  return createServer({
    environment,
    models: {
      haloModel: Model,
    },

    /**
     * Runs a pre-defined set of commands on the server if something besides
     * `{environment: 'test'}` is provided as an argument to the `makeServer`
     * function.
     */
    seeds(server) {
      server.create('user', { name: 'Bob' });
      server.create('user', { name: 'Alice' });
    },

    /**
     * Defines the routes that the mock server will intercept.
     */
    routes() {
      /* Note that in the documentation for Mirage JS they say you can use
      `this.namespace` to set a prefix like baseurl. What they don't tell
      you is that it only works on domains that are the same as the website.
      So that doesn't work for localhost:5000 aka the server address. */

      /**
       * Creates a new model
       */
      this.post(`${baseurl}/model`, (schema, request) => {
        const json = JSON.parse(request.requestBody);
        const modelName = json.label;
        return schema.haloModels.create({
          name: modelName,
        });
      });

      // Gets plot data
      this.get(`${baseurl}/plot`, () => plotData.data);

      // Updates the model
      this.put(`${baseurl}/model`, () => ({}));

      /**
       * Simply adds the new model name to the list of halo models. Doesn't
       * add the model itself.
       * Clones the model
       */
      this.put(`${baseurl}/models`, (schema, request) => {
        const json = JSON.parse(request.requestBody);
        const newModelName = json.new_model_name;
        return schema.haloModels.create(newModelName);
      });

      // Renames the model
      this.patch(`${baseurl}/model`, (schema, request) => {
        const json = JSON.parse(request.requestBody);
        const newModelName = json.new_model_name;
        const oldModelName = json.model_name;
        schema.haloModels.create(newModelName);
        return schema.haloModels.findBy({ name: oldModelName }).destroy();
      });

      // Deletes the model
      this.delete(`${baseurl}/model`, (schema, request) => {
        const json = JSON.parse(request.requestBody);
        const modelName = json["model_name"];
        const tmodel = schema.haloModels.findBy({ name: modelName })
        if (tmodel) {
          return tmodel.destroy();
        }
        return null;
      });

      // Deletes all models
      this.delete(`${baseurl}/models`, (schema) => schema.haloModels.all().destroy());

      // Gets plot data
      this.post(`${baseurl}/plot`, () => plotTypes);
    },
  });
}
