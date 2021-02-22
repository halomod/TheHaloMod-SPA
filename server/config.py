import redis
from os import environ

# flake8: noqa

class Config:
    ''' If a Flask key is not defined then use a pre-defined key '''
    if not environ.get('FLASK_KEY'):
        SECRET_KEY = 'g+hH\xebiv\x9f\x8e\xb8\x95\xed?]>\x81,\x1c\\\xc1\x0fm\x95\x96'
    else:
        SECRET_KEY = environ.get('FLASK_KEY')

    ''' If the app name is not defined then use a pre-defined name '''
    if not environ.get("FLASK_APP"):
        FLASK_APP = 'halomod_app'
    else:
        FLASK_APP = environ.get("FLASK_APP")

    ''' If the flask environment is not defined then use dev '''
    if not environ.get("FLASK_ENV"):
        FLASK_ENV = 'dev'
    else:
        FLASK_ENV = environ.get("FLASK_ENV")

    ''' If the flask debug is not defined then use false '''
    if environ.get("FLASK_DEBUG") is None:
        FLASK_DEBUG = False
    else:
        FLASK_DEBUG = environ.get("FLASK_DEBUG")

    ''' If the session type is not defined then use redis '''
    if not environ.get("SESSION_TYPE"):
        SESSION_TYPE = 'redis'
    else:
        SESSION_TYPE = environ.get("SESSION_TYPE")

    ''' If the redis url is not defined then use localhost '''
    if not environ.get("REDIS_URL"):
        SESSION_REDIS = redis.from_url('redis://localhost:6379')
    else:
        # Docker resolves the container name into the URL
        SESSION_REDIS = redis.Redis(host=environ.get("REDIS_URL"), port=6379)

    PROPOGATE_EXCEPTIONS = True

