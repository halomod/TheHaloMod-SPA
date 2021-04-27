#!/bin/bash

python3 -m venv env
. env/bin/activate

for arg in "$@"
do
  case $arg in
    "--install")
      pip3 install -r requirements.txt;;
    "--lint" )
      autopep8 -a -r --in-place halomod_app
      flake8 tests halomod_app;;
    "--test" )
      python3 -m pytest;;
    "--dev" )
      export FLASK_APP=halomod_app
      export FLASK_ENV=development
      # Doesn't run with SSL on dev so that certs do not need to be handled.
      # To run with SSL on, the following could be run: 
      # `flask run --cert-adhoc`
      flask run;;
    "--generate-constants" )
      echo "Generating constants from run.sh with generate_constants.py..."
      python3 -m generate_constants.py;;
    "--generate-version-file" )
      echo "Generating version file from run.sh with generate_version_file.py..."
      python3 -m generate_version_file.py;;
  esac
done
