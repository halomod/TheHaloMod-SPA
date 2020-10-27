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
default_model_json = jsonpickle.encode(default_model, unpicklable=False)


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
        return jsonify({'test': 'other thing'})

    CORS(app)

    return app
