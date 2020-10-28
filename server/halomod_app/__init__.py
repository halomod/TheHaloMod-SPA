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
        parameters = request.get_json()["params"]
        label = request.get_json()["label"]
        model = utils.hmf_driver(**parameters)
        model_serialized = codecs.encode(pickle.dumps(model), "base64").decode()
        return jsonify({label: model_serialized})

    @app.route('/plot', methods=["POST"])
    def plot():
        request_json = request.get_json()
        fig_type = request_json["fig_type"]
        string_models = request_json["models"]
        models = dict()
        for label, string_model in string_models.items():
            models[label] = pickle.loads(codecs.decode(string_model.encode(), "base64"))
        img_type = request_json["image_type"]
        buf, errors = utils.create_canvas(
            models, fig_type, utils.KEYMAP[fig_type], img_type)

        # Encoding
        png_base64_bytes = base64.b64encode(buf.getvalue())
        base64_png = png_base64_bytes.decode('ascii')
        # Done Encoding

        return jsonify({"figure": base64_png})

    @app.route('/constants', methods=["GET"])
    def constants():
        return jsonify({
            "defaultModel": default_model_json,
            "constantsFromHMF": hmf_defaults
        })

    CORS(app, send_wildcard=True)

    return app
