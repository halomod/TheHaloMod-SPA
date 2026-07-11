import redis
from os import environ

# flake8: noqa


class Config:
    ''' A missing FLASK_KEY is fine in local dev/testing (a public,
    hardcoded key is harmless there), but must not silently happen in a
    real deployment - that would let anyone forge session cookies using a
    key sitting in public source control. '''
    if environ.get('FLASK_KEY'):
        SECRET_KEY = environ.get('FLASK_KEY')
    elif "PYTEST_CURRENT_TEST" in environ or environ.get("FLASK_DEBUG") == "1":
        SECRET_KEY = 'g+hH\xebiv\x9f\x8e\xb8\x95\xed?]>\x81,\x1c\\\xc1\x0fm\x95\x96'
    else:
        raise RuntimeError(
            "FLASK_KEY environment variable is not set. Refusing to start "
            "with the public, hardcoded fallback SECRET_KEY outside of "
            "local development/testing, since that would let sessions be "
            "forged. Set FLASK_KEY to a proper secret."
        )

    ''' If the app name is not defined then use a pre-defined name '''
    if not environ.get("FLASK_APP"):
        FLASK_APP = 'halomod_app'
    else:
        FLASK_APP = environ.get("FLASK_APP")

    ''' If the flask environment is not defined then use dev '''
    FLASK_DEBUG = int(environ.get("FLASK_ENV", "development") == "development")

    # ''' If the flask debug is not defined then use false '''
    # if environ.get("FLASK_DEBUG") is None:
    #     FLASK_DEBUG = False
    # else:
    #     FLASK_DEBUG = environ.get("FLASK_DEBUG")

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

    ''' If the HTTPS session is true, then set that coniguration '''
    if not environ.get("USE_HTTPS_SESSION") or environ.get("USE_HTTPS_SESSION") == "False":
        SESSION_COOKIE_HTTPONLY = True
        SESSION_COOKIE_SECURE = False
    else:
        SESSION_COOKIE_HTTPONLY = False
        SESSION_COOKIE_SECURE = True
        # The below does not work because of a known issue with flask session.
        # It is kept here in case there is an update to Flask-Session that fixes
        # it, and to make it clear what needs to be set once it is fixed.
        SESSION_COOKIE_SAMESITE = 'None'

    ''' Defines email address for the purposes of bug reporting (must be gmail) '''
    if not environ.get("MAIL_USERNAME"):
        MAIL_USERNAME = 'putYourEmailHere@gmail.com'
    else:
        MAIL_USERNAME = environ.get("MAIL_USERNAME")

    ''' Defines password for above username for the purposes of bug reporting '''
    if not environ.get("MAIL_PASSWORD"):
        MAIL_PASSWORD = 'password'
    else:
        MAIL_PASSWORD = environ.get("MAIL_PASSWORD")

    ''' Defines the email address that bug reports should be sent to'''
    MAIL_TO_EMAIL = 'steven.g.murray@asu.edu'

    PROPAGATE_EXCEPTIONS = True
