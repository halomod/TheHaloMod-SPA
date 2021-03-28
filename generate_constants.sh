#!/bin/bash

cd server
sh run.sh --install
echo "Sleeping for 1 second after install"
sleep 1
sh run.sh --generate-constants
# Sleep for 1 sec to prevent an issue with CI where the backend_constants
# file didn't exist quiet yet to the script.
echo "Sleeping for 1 second after constant generation"
sleep 1
cd ..
mkdir -p ./client/generated
mv ./server/backend_constants.json ./client/generated/backend_constants.json