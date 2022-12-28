FROM python:3.9-slim-buster

RUN mkdir /thehalomod-server
WORKDIR /thehalomod-server
COPY . .

# Docker resolves the following container name into the redis URL
ENV REDIS_URL "redis"
ENV FLASK_APP "halomod_app"

RUN apt-get update -y
RUN apt-get install -qq -y build-essential gfortran python-pip python-dev redis-server
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ADD . /thehalomod-server

# Using the "exec" form. See https://docs.docker.com/engine/reference/builder/#cmd
# This makes it so it runs normally and not wrapped in "sh". So this allows
# the container to be attached to and accept input.
#
# The "--cert=adhoc" allows SSH connections to be made to this container
# locally.
CMD ["flask", "run", "--cert=adhoc"]