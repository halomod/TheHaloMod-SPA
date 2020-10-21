from flask import Flask, jsonify, request
from . import utils
import base64
from halomod import TracerHaloModel
import json
import pickle
import codecs
import time


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    @app.route('/')
    def home():
        return jsonify({"start": 'This is the HaloModApp'})

    @app.route('/create', methods=["POST"])
    def create():
        parameters = request.get_json()["params"]
        label = request.get_json()["label"]
        model = utils.hmf_driver(**parameters)
        return jsonify({label: utils.serialize_model(model)})

    @app.route('/plot', methods=["POST"])
    def plot():
        request_json = request.get_json()
        fig_type = request_json["fig_type"]
        string_models = request_json["models"]
        models = dict()
        for label, string_model in string_models.items():
            models[label] = utils.deserialize_model(string_model)
        img_type = request_json["image_type"]
        buf, errors = utils.create_canvas(
            models, fig_type, utils.KEYMAP[fig_type], img_type)
        for key in models:
            models[key] = utils.serialize_model(models[key])

        # Encoding
        png_base64_bytes = base64.b64encode(buf.getvalue())
        base64_png = png_base64_bytes.decode('ascii')
        # Done Encoding

        response = {}
        response["figure"] = base64_png
        response["models"] = models

        return jsonify(response)
    return app
