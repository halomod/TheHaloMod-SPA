FROM python:3.8-slim-buster

RUN apt-get update -y
RUN apt-get install -qq -y build-essential gfortran python-pip python-dev

RUN mkdir /server
WORKDIR /server

COPY ./requirements.txt /server/requirements.txt
RUN python -m pip install -r requirements.txt

COPY . /server

# Add support for Redis
EXPOSE 5000
EXPOSE 6379

CMD ["sh", "-c", "/server/run.sh --dev"]