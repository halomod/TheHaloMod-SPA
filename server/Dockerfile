#FROM tiangolo/uwsgi-nginx-flask:python3.8
#RUN apk --update add bash nano
FROM python:3.8-slim-buster

RUN mkdir /server
WORKDIR /server
COPY . .

ENV STATIC_URL "/static"
ENV STATIC_PATH "/var/www/app/static"
ENV REDIS_URL "redis://localhost"
#ENV FLASK_APP "halomod_app"
ENV FLASK_APP "halomod_app"
ENV FLASK_ENV "development"
ENV FLASK_DEBUG True

RUN apt-get update -y
RUN apt-get install -qq -y build-essential gfortran python-pip python-dev redis-server
RUN pip install -r requirements.txt

#RUN python -m venv /server/env
#COPY ./requirements.txt /server/requirements.txt
#RUN . /server/venv/bin/activate && pip install -r requirements.txt
#RUN pip install -r requirements.txt

ADD . /server

# Add support for Redis
#EXPOSE 5000
#EXPOSE 6379
#redis-server

#CMD . /server/venv/bin/activate && exec flask run
CMD flask run --host=0.0.0.0
#CMD python ./app.py
