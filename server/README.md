# Docker
Run docker using the provided script:

`./dockerStart.py`

## dockerStart Usage


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
export ENV_FILE=settings/base.env
export FLASK_RUN_HOST=0.0.0.0
export FLASK_RUN_PORT=5000
docker-compose up --build --remove-orphans
```

To stop the container:

`docker-compose down`




# Manual Start

## How to Start Server
1. Start up Redis with `redis-server`, which may need to be installed first
1. Run `sh run.sh --dev`

## How to Run Tests
```sh run.sh --test```

## How to run lint
```sh run.sh --lint```

## To start development which includes an environment

`. env/bin/activate`
