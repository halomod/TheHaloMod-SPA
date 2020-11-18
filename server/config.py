import redis

# flake8: noqa

class Config:
    SECRET_KEY = 'g+hH\xebiv\x9f\x8e\xb8\x95\xed?]>\x81,\x1c\\\xc1\x0fm\x95\x96'  # environ.get('FLASK_KEY')

    FLASK_APP = 'halomod_app'  # environ.get("FLASK_APP")
    FLASK_ENV = 'dev'  # environ.get('FLASK_ENV')

    SESSION_TYPE = 'redis'  # environ.get('SESSION_TYPE')
    SESSION_REDIS = redis.from_url('redis://localhost:6379')  # redis.from_url(environ.get('SESSION_REDIS'))
