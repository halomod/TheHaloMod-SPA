from sentry_sdk.integrations.flask import FlaskIntegration
import sentry_sdk
from werkzeug.exceptions import HTTPException
from flask_session import Session
from flask_cors import CORS
from flask import Flask, jsonify, request, session, abort, send_file
from . import utils
from halomod_app.utils import get_model_names
from hmf.helpers.cfg_utils import framework_to_dict
import toml
import json
import dill as pickle
import zipfile
import io
import base64

from .endpoint_model import endpoint_model
from .endpoint_models import endpoint_models
from .endpoint_plot import endpoint_plot

sess = Session()


def create_app(test_config=None):
    """Acts as the main entrypoint for the server. Builds the Flask app and
    the routes."""

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
    )
    app = Flask(__name__, instance_relative_config=True)

    # Everything in config.py Config class is loaded into the Flask app config
    app.config.from_object('config.Config')

    CORS(app, origins="http://localhost:*", supports_credentials=True)  # enable CORS
    sess.init_app(app)  # enable Sessions

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
    """
    app.register_blueprint(endpoint_model)
    app.register_blueprint(endpoint_models)
    app.register_blueprint(endpoint_plot)

    # Generic Exception handler for 500 Internal Server Error
    # Returns manually formatted JSON response object with 500 code,
    # exception name, and description

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        # pass HTTPExceptions to HTTPException handler
        if isinstance(e, HTTPException):
            return e

        response = {}
        description = ""
        if hasattr(e, 'description'):
            description = e.description
        elif hasattr(e, 'args'):
            description = e.args
        else:
            description = 'Error has no description'

        # replace the body with JSON
        response.setdefault('data', json.dumps({
            "code": '500',
            "name": e.name if hasattr(e, 'name') else str(type(e)),
            "description": description,
        }))
        response.setdefault('content_type', "application/json")
        return response

    @app.errorhandler(HTTPException)
    def handle_exception(e):
        """HTTP Exception Handler for error codes 400-499.

        Returns JSON object with error code, exception name, and description"""
        # start with the correct headers and status code from the error
        response = e.get_response()
        # replace the body with JSON
        response.data = json.dumps({
            "code": e.code,
            "name": e.name,
            "description": e.description,
        })
        response.content_type = "application/json"
        return response

    @app.route('/')
    def home():
        return jsonify({"start": 'This is the HaloModApp'})
    
    return app
