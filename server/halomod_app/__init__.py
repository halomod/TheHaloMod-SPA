from flask import Flask, jsonify, request
from . import utils
import base64
from halomod import TracerHaloModel
import json
import pickle
import codecs


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
        encoding = codecs.encode(buf.getvalue(), "base64")
        return jsonify({"figure": str(encoding)})
    return app
