from flask import Flask, url_for, redirect, jsonify, request, session
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

    CORS(app, origins="http://localhost:8080", supports_credentials=True)  # enable CORS
    sess.init_app(app)  # enable Sessions

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

        return jsonify({"model_names": get_model_names()})  # returns new list of model names

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

        request_json = request.get_json()
        fig_type = request_json["fig_type"]

        # below gets correct x attr key ( pulled from create_canvas in utils )
        for x, label in utils.XLABELS.items():
            if utils.KEYMAP[fig_type]["xlab"] == label:
                break

        x_param = x
        y_param = fig_type

        models = None
        res = {"plot_data": {}}
        if 'models' in session:
            models = pickle.loads(session.get("models"))
        else:
            models = {}

        # if model_names in json use those else use all
        names = request_json["model_names"] if "model_names" in request_json else list(models.keys())

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
                print(f"Error encountered getting {fig_type} for model {name}")
                print(e)

            res["plot_data"][name] = data  # put data in response object

        res["plot_details"] = utils.KEYMAP[fig_type]  # put figure metadata into response

        session["models"] = pickle.dumps(models)  # save post-calculation models to session to take advantage of compute

        return jsonify(res);

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

    # Generates a figure using session data & matplotlib rendering and
    # returns it to client
    #
    # expects: {"fig_type": <fig_type> (see utils.KEYMAP for options),
    #           "image type": <format of returned image> (png, svg, etc...)}
    # outputs {"figure": <b64_serialized_figure>}
    @app.route('/plot', methods=["POST"])
    def plot():
        request_json = request.get_json()
        fig_type = request_json["fig_type"]
        img_type = request_json["img_type"]

        if 'models' in session:
            models = pickle.loads(session["models"])
        else:
            models = {}

        # generates figure/plot
        buf, errors = utils.create_canvas(
            models, fig_type, utils.KEYMAP[fig_type], img_type)

        # serializes image so it can be sent via JSON
        png_base64_bytes = base64.b64encode(buf.getvalue())
        base64_png = png_base64_bytes.decode('ascii')

        # save post-calculation models to session
        session["models"] = pickle.dumps(models)

        response = {}
        response["figure"] = base64_png

        return jsonify(response)

    return app
