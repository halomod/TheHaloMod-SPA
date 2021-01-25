import { createServer, Model } from 'miragejs';
import baseurl from '@/env';
import plotData from './example_data/plotData.json';

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
       * Defines what the mock server will do on a POST request to `/create`.
       *
       * If the real server arguments are changed, this should be changed too.
       */
      this.post(`${baseurl}/create`, (schema, request) => {
        const modelName = request.requestBody.label;
        return schema.haloModels.create({
          name: modelName,
        });
      });

      this.post(`${baseurl}/get_plot_data`, () => plotData.data);

      this.post(`${baseurl}/update`, () => ({}));

      /**
       * Simply adds the new model name to the list of halo models. Doesn't
       * add the model itself.
       */
      this.post(`${baseurl}/clone`, (schema, request) => {
        const newModelName = request.requestBody.new_model_name;
        return schema.haloModels.create(newModelName);
      });

      this.post(`${baseurl}/delete`, (schema, request) => {
        const modelName = request.requestBody.model_name;
        return schema.haloModels.findBy({ name: modelName }).destroy();
      });
    },
  });
}
