#!/bin/bash

cd server
sh run.sh --install
echo "run.sh --install has been ran"
sh run.sh --generate-constants
echo "run.sh --generate-constants has been ran"
cd ..
mkdir -p ./client/generated

# Testing to see if the constants file exists
CONSTANTS="./server/backend_constants.json"
if test -f "$CONSTANTS"; then
  echo "$CONSTANTS exists. Proceeding with file move"
  mv ./server/backend_constants.json ./client/generated/backend_constants.json
  echo "File move is complete"
else
  echo "$CONSTANTS does not exist. Throwing error."
  exit 1
fi
