from flask import Flask, jsonify, request
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

# Get default values
default_model = TracerHaloModel.get_all_parameter_defaults()

# Turn the default model into a JSON object
default_model_string = jsonpickle.encode(default_model, unpicklable=False)
default_model_json = json.loads(default_model_string)

# Build the defaults
hmf_defaults = {
    'cosmo': {}
}

# The different cosmological variants in HMF. This could be refactored
# somewhere more visible / configurable in case they change.
cosmo_choices = [
    "Planck15",
    "Planck13",
    "WMAP9",
    "WMAP7",
    "WMAP5"
]

# Build the models so that the constants can be pulled
for choice in cosmo_choices:
    cosmo_model = hmf.cosmo.Cosmology(cosmo_model=getattr(hmf.cosmo, choice))
    hmf_defaults.get('cosmo').setdefault(choice, {
        "h0": cosmo_model.cosmo.H0.value,
        "Ob0": cosmo_model.cosmo.Ob0,
        "Om0": cosmo_model.cosmo.Om0
    })


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

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

        # returns {<model_name>: <serialized_model>}
        return jsonify({label: utils.serialize_model(model)})

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

    @app.route('/constants', methods=["GET"])
    def constants():
        return jsonify({
            "defaultModel": default_model_json,
            "constantsFromHMF": hmf_defaults
        })

    CORS(app, send_wildcard=True)

    return app
