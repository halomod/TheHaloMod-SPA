import { createServer, Model } from 'miragejs';
import baseurl from '@/env';

/**
 * Creates a mock server for use in tests on the front-end.
 *
 * @param {any} object a configuration object for `miragejs` to create the
 * server. The basic thing that can be provided is the following:
 * ```
 * {environment: 'test'}
 * ```
 */
export default function makeServer({ environment = 'development' } = {}) {
  const server = createServer({
    environment,
    models: {
      user: Model,
    },

    /**
     * Runs a pre-defined set of commands on the server if something besides
     * `{environment: 'test'}` is provided as an argument to the `makeServer`
     * function.
     */
    seeds(serverArg) {
      serverArg.create('user', { name: 'Bob' });
      serverArg.create('user', { name: 'Alice' });
    },

    routes() {
      /**
       * `namespace` can be setup to define a basic url extension for the
       * rest of the extensions to be built off of. This can replace what
       * the components or other javascript requests.
       */
      this.namespace = baseurl;

      // Define the routes for the mock server
      this.get('/users', (schema) => schema.users.all());
    },
  });

  return server;
}
