from flask import jsonify, request, session, Blueprint
from . import utils
from .utils import get_model_names
import dill as pickle


endpoint_model = Blueprint('endpoint_model', __name__)

initial_model = utils.get_initial_model()


@endpoint_model.route('/model', methods=["POST"])
def create():
    """Create a new model
    POST /model

    This should only be run one at a time and not consecutively. Use /models
    to create multiple models at once.

    Parameters:
    - params: dict
    - model_name: string

    Example Parameters:
    - `{"params": <dictionary of params>, "label": <model_name>}`

    Returns:
    - model_names: string[]
    - example: `{"model_names": <list_of_model_names_in_session>}`
    """

    params = request.get_json()["params"]
    label = request.get_json()["label"]

    models = None
    if 'models' in session:
        models = pickle.loads(session.get('models'))
    else:
        models = {}

    # Only allow one model to be created at a time. Prevents crashes in the
    # server from Fortran when two models are created at the same time.
    utils.modelCreationSem.acquire()

    num_models = len(models)
    models[label] = utils.hmf_driver(
        previous=initial_model,
        **params)  # creates model from params

    utils.modelCreationSem.release()

    if num_models < len(models):
        session["models"] = pickle.dumps(models)  # writes updated model dict to session
    else:
        raise Exception("Model not computed.")

    return jsonify({"model_names": get_model_names()})


@endpoint_model.route('/model', methods=["PUT"])
def update():
    """Update an existing model
    PUT /model

    Expected parameters:
    - params: dict
    - model_name: string

    Example parameter:
    - `{"model_name": <model_name_to_update>, "params": <dictionary of params>}`

    Returns:
    - model_names: string[]
    - example: `{"model_names": <list_of_model_names_in_session>}`
    """
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


@endpoint_model.route('/model', methods=["DELETE"])
def delete():
    """Delete a model
    DELETE /model

    Parameters:
    - model_name: string
    - example: `{"model_name": <model_name_to_update>}`

    Returns:
    - model_names: string[]
    - example: `{"model_names": <list_of_model_names_in_session>}`
    """
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


@endpoint_model.route('/model', methods=["PATCH"])
def rename():
    """Renames a model based on name and new name.
    PATCH /model

    Parameters:
    - model_name: string
    - new_model_name: string

    Example parameter:
    - `{"model_name": <model_name_to_rename>, "new_model_name": <new_model_name>}`

    Returns:
    - model_names: string[]
    - example: `{"model_names": <list_of_model_names_in_session>}`
    """
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
