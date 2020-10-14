from flask import Flask, jsonify, request
from . import utils
import base64
from halomod import TracerHaloModel

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    @app.route('/')
    def home():
        return jsonify({"start": 'This is the HaloModApp'})

    @app.route('/create', methods=["POST"])
    def create():
        #model_dict = request.get_json()["model"]
        model = {"MODEL": utils.hmf_driver()}
        buf, errors = utils.create_canvas(model, "dndm", utils.KEYMAP["dndm"], "png")
        encoding = base64.b64encode(buf.getvalue())
        return jsonify({"image": str(encoding)})

    return app