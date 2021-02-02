FROM python:3.8-slim-buster

RUN mkdir /thehalomod-server
WORKDIR /thehalomod-server
COPY . .

# Docker resolves the following container name into the redis URL
ENV REDIS_URL "redis"
ENV FLASK_APP "halomod_app"
#ENV FLASK_ENV "development"
#ENV FLASK_DEBUG True

RUN apt-get update -y
RUN apt-get install -qq -y build-essential gfortran python-pip python-dev redis-server
RUN pip install -r requirements.txt

ADD . /thehalomod-server

CMD flask run