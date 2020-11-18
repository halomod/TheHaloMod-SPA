from flask import Flask, jsonify, request, session
from . import utils
import base64
from halomod import TracerHaloModel
import json
import pickle
import codecs
import hmf
from flask_cors import CORS
import jsonpickle
import time
import redis
from flask_session import Session

sess = Session()


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object('config.Config')

    CORS(app, send_wildcard=True)  # enable CORS
    sess.init_app(app)  # enable Sessions

    @app.route('/')
    def home():
        return jsonify({"start": 'This is the HaloModApp'})

    @app.route('/create', methods=["POST"])
    def create():
        # expects json of format {"params": <dictionary of params>, "label": <model_name>}
        parameters = request.get_json()["params"]
        label = request.get_json()["label"]

        # unpacks parameters and passes into hmf_driver class (see utils)
        model = utils.hmf_driver(**parameters)

        # session["models"]["label"] = model

        # returns {<model_name>: <serialized_model>}
        return jsonify({label: utils.serialize_model(model)})

    @app.route('/getNames', methods=["GET"])
    def getNames():
        # return keys of session["models"]
        return "List of Model Names"

    @app.route('/getPlotData', methods=["GET"])
    def getPlotData():
        # if json.models : loop through list else do all automatically
        # get data associated with json.figtype for each model
        # then send back in dict
        return "JSON w/ relevant model data"

    @app.route('/clone', methods=["POST"])
    def clone():
        # get model with name json.modelName
        # clone it
        # add to session.models w/ json.newName
        return "Success message"

    @app.route('/update', methods=["POST"])
    def update():
        # get model with name json.modelName
        # use it w/ hmf driver to generate new model
        # save in session
        return "Success message"

    @app.route('/delete', methods=["POST"])
    def delete():
        # get model with name json.modelName
        # remove it from session
        return "Success message"

    @app.route('/plot', methods=["POST"])
    def plot():
        # expects json of format {"fig_type": <fig_type> (see utils.KEYMAP for options),
        #                         "models": <dict with (label, serialized_model) pairs>,
        #                         "image type": <format of returned image> (png, svg, etc...)}
        request_json = request.get_json()
        fig_type = request_json["fig_type"]
        string_models = request_json["models"]
        img_type = request_json["image_type"]

        # deserializes each model in model dictionary and builds a new dict with (label, TracerHaloModel) pairs
        models = dict()
        for label, string_model in string_models.items():
            models[label] = utils.deserialize_model(string_model)

        # generates figure/plot
        buf, errors = utils.create_canvas(
            models, fig_type, utils.KEYMAP[fig_type], img_type)

        # serializes image so it can be sent via JSON
        png_base64_bytes = base64.b64encode(buf.getvalue())
        base64_png = png_base64_bytes.decode('ascii')

        # serializes updated models post-calculation (to preserve cached results for future calculations)
        for key in models:
            models[key] = utils.serialize_model(models[key])

        response = {}
        response["figure"] = base64_png
        response["models"] = models

        # returns {"models": <update_serialized_models>, "figure": <serialized_figure>}
        return jsonify(response)

        return jsonify({"figure": base64_png})

    return app
