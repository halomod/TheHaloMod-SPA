from flask import Blueprint
from sentry_sdk.integrations.flask import FlaskIntegration
import sentry_sdk
from werkzeug.exceptions import HTTPException
from flask_session import Session
from flask_cors import CORS
from flask import Flask, jsonify, request, session, abort, send_file
from . import utils
from halomod_app.utils import get_model_names
import base64
import json
import dill as pickle
import zipfile
import io
import numpy as np

endpoint_models = Blueprint('endpoint_models', __name__)


"""Get data in models
    GET /models

    Parameters:
    - dataType: string

    Returns:
    - model_names: string[]
"""
@endpoint_models.route('/models', methods=["GET"])
def get_models_data():
    request_json = request.get_json()
    dataType = request_json["dataType"]
    if dataType is "names":
        # This endpoint returns the names of all the models associated with the current
        # session
        #
        # expects: None
        # outputs: {"model_names": <list_of_model_names_in_session>}
        #@app.route('/get_names', methods=["GET"])
        #def get_names():
        res = {"model_names": get_model_names()}
        return jsonify(res)  # returns list of model names
    elif dataType is "ascii":
        #@app.route('/get_object_data', methods=['POST'])
        #def get_object_data():
        """
        Returns vectors associated with each model in the session for each
        parameter passed to the endpoint

        expects: {"param_names": [<param_name>, <param_name>, etc...]}
        outputs {"<model_name>: {<param_name>: <param_data_for_model>, etc...}, etc...}
        """
        request_json = request.get_json()
        param_names = request_json["param_names"]

        if 'models' in session:
            models = pickle.loads(session['models'])
        else:
            models = {}

        res = {}

        for label, obj in models.items():
            res[label] = {}
            for param_name in param_names:
                if getattr(obj, param_name) is not None:
                    res[label][param_name] = list(getattr(obj, param_name))

        return jsonify(res)
    else:
        return ""


"""Clone model
PUT /models

Parameters:
- model_name: string
- new_model_name: string

Returns:
- model_names: string[]
"""
# This endpoint clones a model based on name and adds the new model to the session
#
# expects: {"model_name": <model_name_to_clone>, "new_model_name": <name_for_new_model>}
# outputs: {"model_names": <list_of_model_names_in_session>}
@endpoint_models.route('/models', methods=["PUT"])
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


"""Deletes models
DELETE /models

Parameters:

Returns:
- model_names: string[]
"""
# This endpoint clears all models from the session
#
# expects: None
# outputs: {"model_names": <list_of_model_names_in_session>}
@endpoint_models.route('/models', methods=["DELETE"])
def clear():
    session["models"] = pickle.dumps({})
    res = {"model_names": get_model_names()}
    return jsonify(res)
