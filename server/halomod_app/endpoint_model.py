from flask import Blueprint
from flask import jsonify, request, session
from . import utils
from .utils import get_model_names
from halomod import TracerHaloModel
import dill as pickle

endpoint_model = Blueprint('endpoint_model', __name__)
initial_model = TracerHaloModel(rmax=150, rnum=200, transfer_params={
                                "kmax": 1e3, 'extrapolate_with_eh': True})

"""Create a new model
POST /model

Parameters:
- params: dict
- model_name: string

Returns:
- model_names: string[]
"""


@endpoint_model.route('/model', methods=["POST"])
def create():
    """Handles the creation of models and saving the created model to the session

    expects: {"params": <dictionary of params>, "label": <model_name>}
    outputs: {"model_names": <list_of_model_names_in_session>}"""
    params = request.get_json()["params"]
    label = request.get_json()["label"]

    models = None
    if 'models' in session:
        models = pickle.loads(session.get('models'))
    else:
        models = {}

    num_models = len(models)
    models[label] = utils.hmf_driver(
        previous=initial_model,
        **params)  # creates model from params
    if num_models < len(models):
        session["models"] = pickle.dumps(models)  # writes updated model dict to session
    else:
        raise Exception("Model not computed.")

    return jsonify({"model_names": get_model_names()})


"""Update an existing model
PUT /model

Parameters:
- params: dict
- model_name: string

Returns:
- model_names: string[]
"""


@endpoint_model.route('/model', methods=["PUT"])
def update():
    # This endpoint updates a model based on name & params and updates the session
    #
    # expects: {"model_name": <model_name_to_update>, "params": <dictionary of params>}
    # outputs: {"model_names": <list_of_model_names_in_session>}
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


"""Delete a model
    DELETE /model

    Parameters:
    - model_name: string

    Returns:
    - model_names: string[]
"""


@endpoint_model.route('/model', methods=["DELETE"])
def delete():
    # This endpoint deletes a model based on name and updates the session
    #
    # expects: {"model_name": <model_name_to_update>}
    # outputs: {"model_names": <list_of_model_names_in_session>}
    request_json = request.get_json()
    name = request_json["model_name"]

    models = None
    if 'models' in session:
        models = pickle.loads(session["models"])
    else:
        models = {}

    num_models = len(models)

    if name in models:
        del models[name]

    if num_models > len(models):
        session["models"] = pickle.dumps(models)
    else:
        raise Exception("Error: Model not deleted.")

    res = {"model_names": get_model_names()}
    return jsonify(res)


"""Renames model
    PATCH /model

    Parameters:
    - model_name: string
    - new_model_name: string

    Returns:
    - model_names: string[]
"""


@endpoint_model.route('/model', methods=["PATCH"])
def rename():
    # This endpoint renames a model based on name and new name
    #
    # expects: {"model_name": <model_name_to_rename>, "new_model_name": <new_model_name>}
    # outputs: {"model_names": <list_of_model_names_in_session>}
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
