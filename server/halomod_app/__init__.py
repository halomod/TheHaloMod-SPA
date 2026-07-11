from sentry_sdk.integrations.flask import FlaskIntegration
import sentry_sdk
from werkzeug.exceptions import HTTPException
from flask_session import Session
from flask_session.redis.redis import RedisSessionInterface
from flask_cors import CORS
from flask import Flask, jsonify, session, Response
import json
import re
import sys
import traceback
import os
import warnings

from . import utils
from .endpoint_model import endpoint_model
from .endpoint_models import endpoint_models
from .endpoint_plot import endpoint_plot
from .endpoint_bugs import endpoint_bugs

sess = Session()


def create_app(test_config=None):
    """Acts as the main entrypoint for the server. Builds the Flask app and
    the routes."""

    app = Flask(__name__, instance_relative_config=True)

    # Everything in config.py Config class is loaded into the Flask app config
    app.config.from_object('config.Config')

    this_env = ""
    if "PYTEST_CURRENT_TEST" in os.environ:
        this_env = "testing"
    else:
        this_env = "development" if app.debug else "production"

    # add sentry sdk
    sentry_sdk.init(
        dsn="https://27537774b9d949b7ab5dcbe3ba4496c9@o516709.ingest.sentry.io/5624184",
        integrations=[FlaskIntegration()],

        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=1.0,

        # By default the SDK will try to use the SENTRY_RELEASE
        # environment variable, or infer a git commit
        # SHA as release, however you may want to set
        # something more human-readable.
        # release="myapp@1.0.0",
        environment=this_env
    )

    # The different origins that the server will allow connections from.
    # These are specified as RegEx. Anchored at both ends (flask-cors uses
    # `Pattern.match`, which only anchors at the start) so an origin can't
    # satisfy a pattern by merely embedding the expected domain as a
    # substring, e.g. `https://thehalomod.app.evil.com` - important since
    # `supports_credentials=True` below means a matching origin can make
    # requests using the caller's session cookie.
    origins = [
        re.compile(r'^http://localhost:\d+$'),
        re.compile(r'^https://([a-z0-9-]+--)?thehalomod\.netlify\.app$'),
        re.compile(r'^https://([a-z0-9-]+\.)?thehalomod\.app$'),
    ]

    CORS(app, origins=origins, supports_credentials=True)  # enable CORS

    sess.init_app(app)  # enable Sessions

    # Swap in a session interface that holds a per-session lock across the
    # whole request (see LockingRedisSessionInterface for why a lock scoped
    # only inside a view function isn't enough to prevent two concurrent
    # requests for the same session from racing and silently losing data).
    # Session() already constructed a fully-configured RedisSessionInterface
    # above; changing its class in place (rather than constructing a new
    # instance) reuses that configuration exactly instead of re-guessing it.
    if isinstance(app.session_interface, RedisSessionInterface):
        app.session_interface.__class__ = utils.LockingRedisSessionInterface

    # Set all warnings to trigger
    warnings.filterwarnings("error")

    # halomod's concentration-mass relations (e.g. Bullock01) don't implement
    # mass-definition conversion; when the model's mass definition doesn't
    # match a concentration model's native one, halomod warns and proceeds
    # anyway using the mismatched definition. That's expected, recoverable
    # behaviour (not a bug to fail the request over), so don't let the
    # blanket "error" filter above turn it into a 500.
    warnings.filterwarnings(
        "default",
        message=r"Requested mass definition .* is not in native definitions "
                r"for the .* CMRelation",
    )

    # Register the Endpoints
    """All endpoints:
    POST /model - Creates a new model
    PUT /model - Updates a model
    DELETE /model - Deletes a model
    PATCH /model - Renames a model
    GET /models - Get specified models data
    PUT /models - Clones model
    DELETE /models - Deletes all saved models
    GET /plot - Get plot data
    POST /bugs - Report a model specific bug
    """
    app.register_blueprint(endpoint_model)
    app.register_blueprint(endpoint_models)
    app.register_blueprint(endpoint_plot)
    app.register_blueprint(endpoint_bugs)

    # Generic Exception handler for 500 Internal Server Error
    # Returns manually formatted JSON response object with 500 code,
    # exception name, and description
    if app.config['SESSION_COOKIE_SAMESITE'] == 'None':
        @app.after_request
        def cookies(response: Response):
            """Manually overrides the session cookie to fix an issue with
            Flask-Session.

            `SameSite=None` needs to be specified in order for the remote server
            to set cookies on a client.

            See here: https://github.com/fengsp/flask-session/pull/116
            For the pull request that would fix that issue and make this function
            unecessary."""
            response.headers.add(
                "Set-Cookie", f"session={session.sid}; Secure; SameSite=None; Path=/;"
            )
            return response

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        """Generic Exception handler for 500 Internal Server Error
        Returns manually formatted JSON response object with 500 code,
        exception name, and description
        """
        a = sys.exc_info()
        stkTrace = traceback.format_exception(*a)
        stkTrace.insert(0, "Error: " + str(e))

        # Tell sentry
        sentry_sdk.capture_exception(e)

        # pass HTTPExceptions to HTTPException handler
        if isinstance(e, HTTPException):
            return e

        response = {}

        # Only expose the full traceback (file paths, internals) to callers
        # when running in debug mode. Sentry already has the full exception
        # for developers regardless; a production caller just gets the
        # human-readable summary line.
        description = stkTrace if app.debug else [stkTrace[0]]

        # replace the body with JSON
        response.setdefault('data', json.dumps({
            "code": '500',
            "name": e.name if hasattr(e, 'name') else str(type(e)),
            "description": description,
        }))
        response.setdefault('content_type', "application/json")
        return response, 500

    @app.errorhandler(HTTPException)
    def handle_exception(e):
        """HTTP Exception Handler for error codes 400-499.

        Returns JSON object with error code, exception name, and description"""
        a = sys.exc_info()
        stkTrace = traceback.format_exception(*a)
        stkTrace.insert(0, "Error: " + str(e))

        # Tell sentry
        sentry_sdk.capture_exception(e)

        # start with the correct headers and status code from the error
        response = e.get_response()
        # replace the body with JSON
        response.data = json.dumps({
            "code": e.code,
            "name": e.name,
            "description": stkTrace if app.debug else [stkTrace[0]],
        })
        response.content_type = "application/json"
        return response, 400

    @app.errorhandler(RuntimeWarning)
    def handle_runtime_warning(e):
        """Generic Exception handler for 500 Internal Server Error
        Returns manually formatted JSON response object with 500 code,
        exception name, and description.

        This is not currently used. To use it, the following needs to be added
        to the code in this file. But, note that all errors will turn into
        exceptions.
        ```
        warnings.filterwarnings("error")
        ```
        """
        # Perform stack trace on original exception
        a = sys.exc_info()
        stkTrace = traceback.format_exception(*a)

        # Make the error message pretty for the user
        try:
            warningSource = stkTrace[len(stkTrace) - 2]
            fileIdx = warningSource.find(".py")
            if fileIdx != -1:
                warningSource = warningSource.split(".py")[0]

            if os.name == 'nt':
                warningSourceFile = warningSource.split("\\")
            else:
                warningSourceFile = warningSource.split("/")

            warningSourceFile = warningSourceFile[-1]
        except Exception:
            warningSourceFile = " "

        # Removes function name that caused the warning
        try:
            strException = str(e)
            strException = strException[:strException.find(" in ") + 1]
            if strException == "":
                strException = str(e)
        except Exception:
            strException = str(e)

        if " " in warningSourceFile:
            stkTrace.insert(0, "Warning: " + strException)
        else:
            stkTrace.insert(0, "Warning: " + strException +
                            "\nWarning in: " + warningSourceFile)

        # Tell sentry
        sentry_sdk.capture_exception(e)

        # pass HTTPExceptions to HTTPException handler
        if isinstance(e, HTTPException):
            return e

        response = {}

        # Only expose the full traceback (file paths, internals) to callers
        # when running in debug mode. Sentry already has the full exception
        # for developers regardless; a production caller just gets the
        # human-readable summary line.
        description = stkTrace if app.debug else [stkTrace[0]]

        # replace the body with JSON
        response.setdefault('data', json.dumps({
            "code": '500',
            "name": e.name if hasattr(e, 'name') else str(type(e)),
            "description": description,
        }))
        response.setdefault('content_type', "application/json")
        return response, 500

    @app.route('/')
    def home():
        return jsonify({"start": 'This is the HaloModApp'})

    return app
