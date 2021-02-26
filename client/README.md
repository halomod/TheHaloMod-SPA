# TheHaloMod-SPA Client

## Table of Contents

- [How to run the client locally](#how-to-run-the-client-locally)
- [How to build and run the production version of the client locally](#how-to-build-and-run-the-production-version-of-the-client-locally)
- [Development commands](#development-commands)

## How to run the client locally

1. Make sure you are in the `TheHaloMod-SPA/client` directory in your shell of choice
1. Run `npm install`. (If you don't have npm installed, [see here for instructions](https://github.com/nvm-sh/nvm#installing-and-updating)).
1. Run `npm run serve`

## How to build and run the production version of the client locally

1. Make sure you are in the `TheHaloMod-SPA/client` directory in your shell of choice
1. Run `npm install` if that hasn't already been done. (If you don't have npm installed, [see here for instructions](https://github.com/nvm-sh/nvm#installing-and-updating)).
1. Run `npm run build`
1. Run `serve dist -p 5111`. Note that `-p 5111` sets the port to `5111` because by default the port is set to `5000` which the server is running on. So `5111` can be any port that you choose that isn't already taken. Also if `serve` isn't installed, [see here for instructions](https://www.npmjs.com/package/serve).

## Development commands

- To run tests, use `npm run test` while in the `client` directory
- To lint the application, use `npm run lint` while in the `client` directory
