import { createServer, Model } from 'miragejs';
import baseurl from '@/env';

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
        const attributes = request.requestBody;
        return schema.haloModels.create(attributes);
      });
    },
  });
}
