#!/bin/bash

cd server
sh run.sh --install
sh run.sh --generate-constants
# Sleep for 1 sec to prevent an issue with CI where the backend_constants
# file didn't exist quiet yet to the script.
sleep 1
cd ..
mkdir -p ./client/generated
mv ./server/backend_constants.json ./client/generated/backend_constants.json