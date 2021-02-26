# TheHaloMod-SPA
A single-page application to act as a GUI for [HaloMod](https://github.com/halomod/halomod). A spiritual successor to [TheHaloMod](https://github.com/halomod/TheHaloMod).

[![Github Actions Server CI Workflow](https://img.shields.io/github/workflow/status/halomod/TheHaloMod-SPA/Client%20CI?label=Client%20CI)](https://github.com/halomod/TheHaloMod-SPA/actions/workflows/client.yaml)
[![Github Actions Server CI Workflow](https://img.shields.io/github/workflow/status/halomod/TheHaloMod-SPA/Server%20CI?label=Server%20CI)](https://github.com/halomod/TheHaloMod-SPA/actions/workflows/server.yaml)
[![Github License](https://img.shields.io/github/license/halomod/TheHaloMod-SPA)]()

## Table of Contents

- [How to run it locally](#how-to-run-it-locally)
- [Architecture](#architecture)

## How to run it locally

1. Clone the repo locally.
1. Run `cd TheHaloMod-SPA`. In other words, move into that directory in your shell of choice. 
1. Get the server up and running. Instructions are in [the server readme](server/README.md).
1. Startup the client. Instructions are in [the client readme](client/README.md).

## Architecture

The overall architecture of TheHaloMod-SPA is broken up into two parts: `server` and `client`. From a high-level perspective, the server handles the API portion of the website, and the client holds the front-end. This way, the front-end can benefit from modern JavaScript UI libraries and the backend can run all the Python code of the various libraries that this project is based on.

Each part, the server and the client, have their own documentation on their architecutre in their readmes. This includes info on the package managers they use, general thought and design considerations, as well as other aspects.

- [`server` architecture](server/README.md#architecture)
- [`client` architecture](client/README.md#architecture)

### GitHub Actions

The only parts that are not included in the server and client at this moment are the GitHub workflows. Those are included in root as required by GitHub. Github workflows are an aspect of [GitHub Actions](https://docs.github.com/en/actions) and form the [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) part of this project. Some of the things that the Github workflows are setup to do are:

- Run tests on both the server and client when new pushes are made to any branch in the project
- Run linting on both the server and client when new pushes are made to any branch in the project
- Deploy the client when a new push is made to the `main` branch 
