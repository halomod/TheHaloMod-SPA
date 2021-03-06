"""Holds the main entrypoint for the server."""


from flask import Flask, url_for, redirect, jsonify, request, session, abort, send_file
from . import utils
import base64
from halomod import TracerHaloModel
import json
import zipfile
import dill as pickle
import codecs
import hmf
from flask_cors import CORS
import numpy as np
import redis
from flask_session import Session
import io
from werkzeug.exceptions import InternalServerError, HTTPException
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

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

    # Generic Exception handler for 500 Internal Server Error
    # Returns manually formatted JSON response object with 500 code,
    # exception name, and description
    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        # pass HTTPExceptions to HTTPException handler
        if isinstance(e, HTTPException):
            return e

        response = {}
        # replace the body with JSON
        response.data = json.dumps({
            "code": '500',
            "name": e.name,
            "description": e.description,
        })
        response.content_type = "application/json"
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

    # Helper function that abstracts logic for getting names of all models
    # associated with the function
    def get_model_names():
        if 'models' in session:
            models = pickle.loads(session.get('models'))
        else:
            models = {}
        return list(models.keys())

    @app.route('/')
    def home():
        return jsonify({"start": 'This is the HaloModApp'})

    # This endpoint handles the creation of models and saving the created model to
    # the session
    #
    # expects: {"params": <dictionary of params>, "label": <model_name>}
    # outputs: {"model_names": <list_of_model_names_in_session>}
    @app.route('/create', methods=["POST"])
    def create():
        params = request.get_json()["params"]
        label = request.get_json()["label"]

        models = None
        if 'models' in session:
            models = pickle.loads(session.get('models'))
        else:
            models = {}

        models[label] = utils.hmf_driver(**params)  # creates model from params
        session["models"] = pickle.dumps(models)  # writes updated model dict to session

        # returns new list of model names
        return jsonify({"model_names": get_model_names()})

    # This endpoint returns the names of all the models associated with the current
    # session
    #
    # expects: None
    # outputs: {"model_names": <list_of_model_names_in_session>}
    @app.route('/get_names', methods=["GET"])
    def get_names():
        res = {"model_names": get_model_names()}
        return jsonify(res)  # returns list of model names

    # This endpoint returns plot data required for front-end plotting from session data
    #
    # expects: {"fig_type": <choice_from_KEYMAP>, (OPTIONAL) "model_names": <array_of_model_names_to_consider> }
    # outputs: {"plot_details":
    #             {"xlab": <str_xlabel>, "ylab": <str_ylabel>, "yscale": <str_yscale>},
    #          "plot_data": {
    #              <model_label>: {"xs": <array_of_xs>, "ys": <array_of_ys>},
    #              ...
    #           }}
    @app.route('/get_plot_data', methods=["POST"])
    def get_plot_data():
        res = {"plot_data": {}}
        request_json = request.get_json()
        x_param = request_json["x"]
        y_param = request_json["y"]

        models = None
        if 'models' in session:
            models = pickle.loads(session.get("models"))
        else:
            models = {}
        # if model_names in json use those else use all
        names = request_json["model_names"] if "model_names" in request_json else list(
            models.keys())

        for name in names:
            model = models[name]  # gets model with label <name>
            data = {}
            try:
                ys = getattr(model, y_param)  # gets y array
                xs = getattr(model, x_param)  # gets x array
                mask = ys > 1e-40 * ys.max()  # creates mask as seen in create_canvas in utils
                data["ys"] = list(ys[mask])  # apply mask and save ys into data dict
                data["xs"] = list(xs[mask])  # apply mask and save xs into data dict
            except Exception as e:
                abort(400, f"Error encountered getting {y_param} for model {name}. {str(e)}.")
                print(f"Error encountered getting {y_param} for model {name}")
                print(e)

            res["plot_data"][name] = data  # put data in response object

        # put figure metadata into response
        res["plot_details"] = utils.KEYMAP[y_param]

        # save post-calculation models to session to take advantage of compute
        session["models"] = pickle.dumps(models)

        return jsonify(res)

    # This endpoint renames a model based on name and new name
    #
    # expects: {"model_name": <model_name_to_rename>, "new_model_name": <new_model_name>}
    # outputs: {"model_names": <list_of_model_names_in_session>}
    @app.route('/rename', methods=["POST"])
    def rename():

        request_json = request.get_json()
        name = request_json["model_name"]
        new_name = request_json["new_model_name"]

        models = None
        if 'models' in session:
            models = pickle.loads(session["models"])
        else:
            models = {}

        if name in models:
            models[new_name] = models[name]
            del models[name]

        session["models"] = pickle.dumps(models)

        res = {"model_names": get_model_names()}
        return jsonify(res)

    # This endpoint clones a model based on name and adds the new model to the session
    #
    # expects: {"model_name": <model_name_to_clone>, "new_model_name": <name_for_new_model>}
    # outputs: {"model_names": <list_of_model_names_in_session>}
    @app.route('/clone', methods=["POST"])
    def clone():

        request_json = request.get_json()
        name = request_json["model_name"]
        new_name = request_json["new_model_name"]

        models = None
        if 'models' in session:
            models = pickle.loads(session["models"])
        else:
            models = {}

        if name in models:
            models[new_name] = models[name].clone()

        session["models"] = pickle.dumps(models)

        res = {"model_names": get_model_names()}
        return jsonify(res)

    # This endpoint updates a model based on name & params and updates the session
    #
    # expects: {"model_name": <model_name_to_update>, "params": <dictionary of params>}
    # outputs: {"model_names": <list_of_model_names_in_session>}
    @app.route('/update', methods=["POST"])
    def update():

        request_json = request.get_json()
        name = request_json["model_name"]
        params = request_json["params"]

        models = None
        if 'models' in session:
            models = pickle.loads(session["models"])
        else:
            models = {}

        if name in models:
            models[name] = utils.hmf_driver(previous=models[name], **params)

        session["models"] = pickle.dumps(models)

        res = {"model_names": get_model_names()}
        return jsonify(res)

    # This endpoint deletes a model based on name and updates the session
    #
    # expects: {"model_name": <model_name_to_update>}
    # outputs: {"model_names": <list_of_model_names_in_session>}
    @app.route('/delete', methods=["POST"])
    def delete():
        request_json = request.get_json()
        name = request_json["model_name"]

        models = None
        if 'models' in session:
            models = pickle.loads(session["models"])
        else:
            models = {}

        if name in models:
            del models[name]

        session["models"] = pickle.dumps(models)

        res = {"model_names": get_model_names()}
        return jsonify(res)

    # This endpoint clears all models from the session
    #
    # expects: None
    # outputs: {"model_names": <list_of_model_names_in_session>}
    @app.route('/clear', methods=["POST"])
    def clear():
        session["models"] = pickle.dumps({})
        res = {"model_names": get_model_names()}
        return jsonify(res)

    # Generates a figure using session data & matplotlib rendering and
    # returns it to client
    #
    # expects: {"fig_type": <fig_type> (see utils.KEYMAP for options),
    #           "image type": <format of returned image> (png, svg, etc...)}
    # outputs {"figure": <b64_serialized_figure>}
    @app.route('/plot', methods=["POST"])
    def plot():
        request_json = request.get_json()
        x = request_json["x"]
        y = request_json["y"]
        img_type = request_json["img_type"]

        if 'models' in session:
            models = pickle.loads(session["models"])
        else:
            models = {}
        # generates figure/plot not working!
        buf, errors = utils.create_canvas(
            models, x, y, img_type)

        # serializes image so it can be sent via JSON
        png_base64_bytes = base64.b64encode(buf.getvalue())
        base64_png = png_base64_bytes.decode('ascii')

        # save post-calculation models to session
        session["models"] = pickle.dumps(models)

        response = {}
        response["figure"] = base64_png

        return jsonify(response)

    @app.route('/ascii', methods=['GET'])
    def ascii():
        """ Builds and sends the text data for each model stored in the session.

        get:
          responses:
            200:
              description: "Returns the zip file containining the different data files for each model in the user's session"
              content:
                application/zip:
        """
        models = None
        if 'models' in session:
            models = pickle.loads(session.get("models"))
        else:
            models = {}

        labels = list(models.keys())
        objects = list(models.values())

        # Open up file-like objects for response
        buff = io.BytesIO()
        archive = zipfile.ZipFile(buff, "w", zipfile.ZIP_DEFLATED)

        # Write out mass-based, k-based and r-based data files
        for index, object in enumerate(objects):
            for kind in utils.XLABELS:

                s = io.BytesIO()

                s.write(f"# [0] {utils.XLABELS[kind]}".encode())

                items = {
                    k: utils.KEYMAP[k]["ylab"]
                    for k in utils.KEYMAP
                    if utils.KEYMAP[k]["xlab"] == utils.XLABELS[kind]
                }

                for j, (label, ylab) in enumerate(items.items()):
                    if getattr(object, label) is not None:
                        s.write(f"# [{j+1}] {ylab}".encode())

                out = np.array(
                    [getattr(object, kind)] + [
                        getattr(object, label)
                        for label in items
                        if getattr(object, label) is not None
                    ]
                ).T
                np.savetxt(s, out)

                archive.writestr(f"{kind}Vector_{labels[index]}.txt", s.getvalue())

                s.close()

        archive.close()

        # Reset the location of the buffer to the beginning
        buff.seek(0)

        return send_file(buff, as_attachment=True, attachment_filename="all_plots.zip")

    return app
