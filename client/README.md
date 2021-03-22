# TheHaloMod-SPA Client

[![Github Actions Client CI Workflow](https://img.shields.io/github/workflow/status/halomod/TheHaloMod-SPA/Client%20CI?label=Client%20CI)](https://github.com/halomod/TheHaloMod-SPA/actions/workflows/client.yaml)

## Table of Contents

- [Usage](#usage)
  - [How to run the client locally](#how-to-run-the-client-locally)
  - [How to build and run the production version of the client locally](#how-to-build-and-run-the-production-version-of-the-client-locally)
  - [Development commands](#development-commands)
- [Architecture](#architecture)

## Usage

### How to run the client locally

1. Make sure you are in the `TheHaloMod-SPA/client` directory in your shell of choice
1. Run `npm install`. (If you don't have npm installed, [see here for instructions](https://github.com/nvm-sh/nvm#installing-and-updating)).
1. Run `npm run setup`
1. Run `npm run serve`
1. The client should be available on `localhost:8080`

### How to build and run the production version of the client locally

1. Make sure you are in the `TheHaloMod-SPA/client` directory in your shell of choice
1. Run `npm install` if that hasn't already been done. (If you don't have npm installed, [see here for instructions](https://github.com/nvm-sh/nvm#installing-and-updating)).
1. Run `npm run build` and wait for it to finish
1. Run `serve dist -p 5111`. Note that `-p 5111` sets the port to `5111` because by default the port is set to `5000` which the server is running on. So `5111` can be any port that you choose that isn't already taken. Also if `serve` isn't installed, [see here for instructions](https://www.npmjs.com/package/serve).

### Development commands

- To run tests, use `npm run test` while in the `client` directory
- To lint the application, use `npm run lint` while in the `client` directory

## Architecture

The `client` is the front-end to TheHaloMod-SPA. It makes requests to the api (the server) and communicates the responses to the user. The most important thing to keep in mind is that the `client` is built with [Vue](https://vuejs.org/). So much of the folder structure and files are built according to the standards of Vue. Some other key aspects of the site are below, with some details:

- Testing: This is handled by [vue-test-utils](https://vue-test-utils.vuejs.org/). All of the tests are currently held in `client/tests`.
- Routing: Routing is how the website handles different urls in the url bar of the browser. This is handled by [vue-router](https://router.vuejs.org/). The routing logic is currently contained in [`client/src/router/index.js`](src/router/index.js), while the "views" that the routes point to are located in `client/src/views`. 
- Client-side Storage: Data is stored on the client side using [idb-keyval](https://github.com/jakearchibald/idb-keyval). This is used to store things like model parameters, and plot information so that a trip doesn't need to be made to the server on every page refresh. This information can be cleared by having the user clear their browser cache for the site. All of the local storage operations are coordinated by the `Store` which is located at [`client/src/utils/Store.js`](src/utils/Store.js).
- Linting: Linting is handled by [ESLint](https://eslint.org/), and the configuration for ESLint is held in [`client/.eslintrc.js`](.eslintrc.js).
- Package Management: Package management is handled mostly by [npm](https://www.npmjs.com/). Although there is a `yarn.lock` file which can be used for [yarn](https://yarnpkg.com/).

Some folder descriptions are below:

- `client/src/assets`: Holds images and other static assets for the site
- `client/src/components`: Holds the different UI components that are used in views. 
- `client/src/constants`: Holds values and settings that are not modified during the application run-time, but are useful as a single file. 
- `client/src/utils`: Holds JavaScript files that provide some kind of utility to the application, but do not house any Vue functionality themselves.

Besides the things mentioned here, documentation exists in each file to provide guidance on what each does. 