#!/bin/bash
app="thehalomod.server"
#docker build -t ${app} .
#docker run -dt -p 5000:5000/tcp ${app}
docker-compose up --build