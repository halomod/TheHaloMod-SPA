# TheHaloMod-SPA Server

[![Github Actions Server CI Workflow](https://img.shields.io/github/workflow/status/halomod/TheHaloMod-SPA/Server%20CI?label=Server%20CI)](https://github.com/halomod/TheHaloMod-SPA/actions/workflows/server.yaml)

## Table of Contents

  - [Usage](#usage)
    - [How to start the server locally](#how-to-start-the-server-locally)
    - [Development commands](#development-commands)
    - [Production deployment using docker](#production-deployment-using-docker)
  - [Architecture](#architecture)
  - [Manual setup](#manual-setup)
  - [Common issues](#common-issues)
    - [Model issues in redis](#model-issues-in-redis)
    - [Numpy or RankWarning](#numpy-or-rankwarning)

## Usage

Before doing any of the commands below, make sure to install the Python packages first. That can be done like so:

1. Make sure you are in the `server` directory in your shell of choice
1. Run `. ./run.sh --install`. This will install all of the dependencies in [`requirements.txt`](requirements.txt) and enter into a [virtual environment](https://docs.python.org/3/tutorial/venv.html).

### How to start the server locally

1. Open a second shell window (secondary to the shell that has a working directory of `server`. See the first step above.)
1. In the second shell window, start up a [Redis DB](https://redis.io/) by running `redis-server`, which may need to be installed first. If this isn't installed yet, [see here on how to install it](https://redis.io/topics/quickstart).
1. If you need to have the bug reporting feature on while running the server locally, then set the username and password for the gmail account to use to send emails. This can be done by running `export MAIL_USERNAME=someemail@gmail.com` and then `export MAIL_PASSWORD=yourPassword` in the same shell that will be running the server. In production, this is handled with Github Secrets and the server deployment.
1. In the first shell window, run `. ./run.sh --dev`
1. The server should now be located at `localhost:5000`

If an issue comes up where it says that the port is already used, check to see if redis is running in another terminal somewhere, or in a background service. By default redis runs as a service, so it might not be necessary to run it in another terminal if it is.

### Development commands

- To test, run `. ./run.sh --test`
- To lint, run `. ./run.sh --lint`

### Production deployment using docker

To run docker manually, first export the needed environment variables. For deployment of this repository, Github actions will use Github secrets to define these variables. View [serverDeployment.yaml](../.github/workflows/serverDeployment.yaml) for the Github action that is performed for deployment. That action has the most up-to-date commands that should be used to deploy the server locally. 

To stop the container:

`docker-compose down`

When trying to configure something that impacts the server running docker, it can be helpful to view the logs of the server in real-time. To view the current readout of the docker container that is running the TheHaloMod-SPA server, first find the docker container with `docker container ls`, which should give a readout similar to the image below:

<image src="https://i.imgur.com/abtYIo7.png" width="400" alt="docker container readout screenshot">

We want the conatiner ID, which in the previous image is `f3c98fe2517`. After finding the ID go ahead and type in the following to get an active feed of the ouptut from the server:

```
docker container logs <containerID> -f
```

which in this case would be:

```
docker container logs f3c98fe2517 -f
```

`-f` means to follow the feed, so as new data comes in the logs will update automatically. To close out of the active feed, use ctrl+c. 

## Architecture

The `server` is the back-end to TheHaloMod-SPA application. It provides the API, and database for the sessions of each visitor to the site. The key framework the server is built with is [Flask](https://flask.palletsprojects.com/en/1.1.x/). Some key aspects of the server and some details are below:

- Testing: Testing is done with [Pytest](https://docs.pytest.org/en/stable/). The tests are all held in the `server/tests` folder.
- Linting and Formatting: Linting is handled by [Flake8](https://flake8.pycqa.org/en/latest/) while formatting during development is handled by [autopep8](https://pypi.org/project/autopep8/). The configuration for Flake8 can be found in [`server/.flake8`](.flake8). autopep8 typically follows the configuration of Flake8.
- Package Management: Package management is handled by [pip3](https://pip.pypa.io/en/stable/) with the assistance of the Python built-in [venv module](https://docs.python.org/3/tutorial/venv.html).

The entrypoint of the server is [`server/halomod_app/__init__.py`](halomod_app/__init__.py) which builds the Flask application and adds routes to it. This file is used as the main location for the top-level server functionality. The [`server/halomod_app/utils.py`](halomod_app/utils.py) houses the extra functionality or constants that have been abstracted out of the main server logic. 

Besides the things mentioned here, documentation exists in each file to provide guidance on what each does. 

## Manual setup
Follow the steps below if you are unable to use [run.sh](./run.sh). Use run.sh as a reference to this section.

Set up virtual env
```sh
python3 -m venv env
. env/bin/activate
```
Dependency installation
```sh
pip3 install -r requirements.txt;;
```
Starting the server
```sh
export FLASK_APP=halomod_app
export FLASK_ENV=development
flask run;;
```
Testing
```sh
python3 -m pytest;;
```
Linting
```sh
autopep8 -a -r --in-place halomod_app # fixes autofixable lint errors
flake8 tests halomod_app;;
```

## Common issues
### Model issues in redis

- Sometimes while developing it can be useful to clear the redis DB of data if issues arise with the models. This can be done in a separate terminal than that which is running redis by typing `redis-cli FLUSHDB`.

### Numpy or RankWarning

If you get an error like the below while running the dev startup command:

```
RuntimeError: Polyfit sanity test emitted a warning, most likely due to using a buggy Accelerate backend. If you compiled yourself, see site.cfg.example for information. Otherwise report this to the vendor that provided NumPy.
RankWarning: Polyfit may be poorly conditioned
```

Then it might have something to do with how [numpy](https://numpy.org/) is built. In prior testing, this happens only on a mac, but in order to fix it you can run the following command to rebuild numpy with only binary and not compile it:

```
pip3 install --upgrade --only-binary :all: numpy
```

For the thread that describes this, [see here](https://github.com/numpy/numpy/issues/15947).
