from sentry_sdk.integrations.flask import FlaskIntegration
import sentry_sdk
from werkzeug.exceptions import HTTPException
from flask_session import Session
from flask_cors import CORS
from flask import Flask, jsonify, session, Response
import json
import re
import sys
import traceback
import os
import warnings

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
        this_env = app.env

    # Setup debugging if the environment is development
    if this_env == "development":
        app.debug = True

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
    # These are specified as RegEx.
    origins = [
        re.compile(r'http\:\/\/localhost\:.*'),
        re.compile(r'https:\/\/.*thehalomod\.netlify\.app.*'),
        re.compile(r'https:\/\/.*thehalomod\.app.*'),
    ]

    CORS(app, origins=origins, supports_credentials=True)  # enable CORS

    sess.init_app(app)  # enable Sessions

    # Set all warnings to trigger
    warnings.filterwarnings("error")

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

        # replace the body with JSON
        response.setdefault('data', json.dumps({
            "code": '500',
            "name": e.name if hasattr(e, 'name') else str(type(e)),
            "description": stkTrace,
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
            "description": stkTrace,
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

        # replace the body with JSON
        response.setdefault('data', json.dumps({
            "code": '500',
            "name": e.name if hasattr(e, 'name') else str(type(e)),
            "description": stkTrace,
        }))
        response.setdefault('content_type', "application/json")
        return response, 500

    @app.route('/')
    def home():
        return jsonify({"start": 'This is the HaloModApp'})

    return app
