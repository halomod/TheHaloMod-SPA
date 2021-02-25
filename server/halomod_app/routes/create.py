from halomod_app import utils
from flask import Blueprint, jsonify, session, request
import pickle
from halomod_app.utils import get_model_names

create_bp = Blueprint('create', __name__)


@create_bp.route('/', methods=["POST"], strict_slashes=False)
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

    models[label] = utils.hmf_driver(**params)  # creates model from params
    session["models"] = pickle.dumps(models)  # writes updated model dict to session

    # returns new list of model names
    return jsonify({"model_names": get_model_names()})
