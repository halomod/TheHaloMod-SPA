# Docker
Run docker using the provided script:

`./dockerStart.sh`

Or just run:

`docker-compose up --build --remove-orphans`

To stop the container:

`docker-compose down`

Run tests:

``

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
