#!/bin/bash

cd server
sh run.sh --install
cd ..
mkdir -p ./client/generated
mv ./server/backend_constants.json ./client/generated/backend_constants.json