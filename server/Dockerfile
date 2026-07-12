FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

RUN mkdir /thehalomod-server
WORKDIR /thehalomod-server
COPY . .

# Docker resolves the following container name into the redis URL
ENV REDIS_URL "redis"
ENV FLASK_APP "halomod_app"

RUN apt-get update -y
RUN apt-get install -qq -y build-essential gfortran redis-server
#RUN pip install --upgrade pip
RUN uv pip install --system -r requirements.txt

ADD . /thehalomod-server

RUN chmod +x docker-entrypoint.sh

# Replaces Flask's development server (which explicitly warns against
# production use) with gunicorn - see docker-entrypoint.sh for the actual
# invocation and why its flags are set the way they are.
ENTRYPOINT ["./docker-entrypoint.sh"]