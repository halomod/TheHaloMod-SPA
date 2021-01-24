FROM python:3.8-slim-buster

ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

RUN apt-get update -y
RUN apt-get install -qq -y build-essential gfortran python-pip python-dev

RUN mkdir /server
WORKDIR /server

COPY ./requirements.txt /server/requirements.txt
RUN python -m pip install -r requirements.txt

COPY . /server

# Add support for Redis
EXPOSE 5000

CMD ["sh", "-c", "/server/run.sh --dev"]