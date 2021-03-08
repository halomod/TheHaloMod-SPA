# TheHaloMod-SPA Server

## Docker
Run docker using the provided script:

`./dockerStart.py`

### dockerStart Usage


```
USAGE: dockerStart.py [OPTIONS]

  Running dockerStart.py with no options is equivalent to:
  dockerStart.py -b --port=5000 --url=0.0.0.0

Options:     
     -h, --help       Show this command list
     -p, --prod       For production (Enables nginx)
     -b, --base       Base install (No nginx, no pytest, yes debug mode)
     --port=[port]    Set the port for Flask
     --url=[url]      Set the url for Flask
```

If you dont want to use the above you can start the container with:

```
export ENV_FILE=settings/base.conf
export FLASK_RUN_HOST=0.0.0.0
export FLASK_RUN_PORT=5000
docker-compose up --build --remove-orphans
```

To stop the container:

`docker-compose down`

## Manual Start

### How to Start Server
1. Start up Redis with `redis-server`, which may need to be installed first
1. Run `sh run.sh --dev`


[![Github Actions Server CI Workflow](https://img.shields.io/github/workflow/status/halomod/TheHaloMod-SPA/Server%20CI?label=Server%20CI)](https://github.com/halomod/TheHaloMod-SPA/actions/workflows/server.yaml)

## Table of Contents

- [TheHaloMod-SPA Server](#thehalomod-spa-server)
  - [Docker](#docker)
    - [dockerStart Usage](#dockerstart-usage)
  - [Manual Start](#manual-start)
    - [How to Start Server](#how-to-start-server)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
    - [How to start the server locally](#how-to-start-the-server-locally)
    - [Development commands](#development-commands)
  - [Architecture](#architecture)

## Usage

Before doing any of the commands below, make sure to install the Python packages first. That can be done like so:

1. Make sure you are in the `server` directory in your shell of choice
1. Run `. ./run.sh --install`. This will install all of the dependencies in [`requirements.txt`](requirements.txt) and enter into a [virtual environment](https://docs.python.org/3/tutorial/venv.html).

### How to start the server locally

1. Open a second shell window (secondary to the shell that has a working directory of `server`. See the first step above.)
1. In the second shell window, start up a [Redis DB](https://redis.io/) by running `redis-server`, which may need to be installed first. If this isn't installed yet, [see here on how to install it](https://redis.io/topics/quickstart).
1. In the first shell window, run `. ./run.sh --dev`
1. The server should now be located at `localhost:5000`

### Development commands

- To test, run `. ./run.sh --test`
- To lint, run `. ./run.sh --lint`

## Architecture

The `server` is the back-end to TheHaloMod-SPA application. It provides the API, and database for the sessions of each visitor to the site. The key framework the server is built with is [Flask](https://flask.palletsprojects.com/en/1.1.x/). Some key aspects of the server and some details are below:

- Testing: Testing is done with [Pytest](https://docs.pytest.org/en/stable/). The tests are all held in the `server/tests` folder.
- Linting and Formatting: Linting is handled by [Flake8](https://flake8.pycqa.org/en/latest/) while formatting during development is handled by [autopep8](https://pypi.org/project/autopep8/). The configuration for Flake8 can be found in [`server/.flake8`](.flake8). autopep8 typically follows the configuration of Flake8.
- Package Management: Package management is handled by [pip3](https://pip.pypa.io/en/stable/) with the assistance of the Python built-in [venv module](https://docs.python.org/3/tutorial/venv.html).

The entrypoint of the server is [`server/halomod_app/__init__.py`](halomod_app/__init__.py) which builds the Flask application and adds routes to it. This file is used as the main location for the top-level server functionality. The [`server/halomod_app/utils.py`](halomod_app/utils.py) houses the extra functionality or constants that have been abstracted out of the main server logic. 

Besides the things mentioned here, documentation exists in each file to provide guidance on what each does. 
