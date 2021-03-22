#!/bin/bash

python3 -m venv env
. env/bin/activate

for arg in "$@"
do
  case $arg in
    "--install")
      python3 -m pip install -r requirements.txt;;
    "--lint" )
      autopep8 -a -r --in-place halomod_app
      flake8 tests halomod_app;;
    "--test" )
      python -m pytest;;
    "--dev" )
      export FLASK_APP=halomod_app
      export FLASK_ENV=development
      flask run;;
    "--generate-constants" | "-gc" )
      python3 generate_constants.py;;
  esac
done
