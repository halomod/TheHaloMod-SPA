# TheHaloMod-SPA Server

[![Github Actions Server CI Workflow](https://img.shields.io/github/workflow/status/halomod/TheHaloMod-SPA/Server%20CI?label=Server%20CI)](https://github.com/halomod/TheHaloMod-SPA/actions/workflows/server.yaml)

## Table of Contents

- [Usage](#usage)
  - [How to start the server locally](#how-to-start-the-server-locally)
  - [Development commands](#development-commands)
- [Architecture](#architecture)

## Usage

Before doing any of the commands below, make sure to install the Python packages first. That can be done like so:

1. Make sure you are in the `server` directory in your shell of choice
1. Run `. ./run.sh --install`. This will install all of the dependencies in `requirements.txt` and enter into a [virtual environment](https://docs.python.org/3/tutorial/venv.html).

### How to start the server locally

1. Open a second shell window (secondary to the shell that has a working directory of `server`. See the first step above.)
1. In the second shell window, start up a [Redis DB](https://redis.io/) by running `redis-server`, which may need to be installed first. If this isn't installed yet, [see here on how to install it](https://redis.io/topics/quickstart).
1. In the first shell window, run `. ./run.sh --dev`
1. The server should now be located at `localhost:5000`

### Development commands

- To test, run `. ./run.sh --test`
- To lint, run `. ./run.sh --lint`

## Architecture


