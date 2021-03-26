#!/bin/bash

cd server
sh run.sh --install
sh run.sh --generate-constants
cd ..
mkdir -p ./client/generated
mv ./server/backend_constants.json ./client/generated/backend_constants.json