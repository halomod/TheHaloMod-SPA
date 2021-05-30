from flask import Blueprint
from flask import jsonify, request, session, send_file
from .utils import get_model_names
from hmf.helpers.cfg_utils import framework_to_dict
import toml
import dill as pickle
import zipfile
import io

endpoint_models = Blueprint('endpoint_models', __name__)


"""Get data in models
    GET /models

    Parameters:
    - dataType: string

    Returns:
    - model_names: string[]
"""


@endpoint_models.route('/models/names', methods=["GET"])
def get_models_data_names():
    # This endpoint returns the names of all the models associated with the current
    # session
    #
    # expects: None
    # outputs: {"model_names": <list_of_model_names_in_session>}
    # @app.route('/get_names', methods=["GET"])
    # def get_names():
    res = {"model_names": get_model_names()}
    return jsonify(res)  # returns list of model names


@endpoint_models.route('/models/object', methods=["GET"])
def get_models_data_object():
    """
    Returns vectors associated with each model in the session for each
    parameter passed to the endpoint

    expects: {"param_names": [<param_name>, <param_name>, etc...]}
    outputs {"<model_name>: {<param_name>: <param_data_for_model>, etc...}, etc...}
    """
    param_names = request.args.getlist("param_names[]")

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


@endpoint_models.route('/models/toml', methods=["GET"])
def get_models_data_toml():
    # @app.route('/toml', methods=['GET'])
    # def toml_route():
    """ Builds and sends a toml file for each model in the user's session in a
    zip folder. These can be used to input into the `halomod` library by
    running the following in your shell:
    `halomod run --config "tomlFileName.toml"`.

    get:
    responses:
        200:
        description: "Returns the zip file containining the different toml files for each model in the user's session"
        content:
            application/zip:
    """
    models = None
    if 'models' in session:
        models = pickle.loads(session.get("models"))
    else:
        models = {}

    # Open up file-like objects for response
    buff = io.BytesIO()
    archive = zipfile.ZipFile(buff, "w", zipfile.ZIP_DEFLATED)

    for label, object in models.items():
        s = io.BytesIO()
        s.write(toml.dumps(framework_to_dict(object),
                           encoder=toml.TomlNumpyEncoder()).encode())
        archive.writestr(f"{label}.toml", s.getvalue())
        s.close()

    archive.close()

    # Reset the location of the buffer to the beginning
    buff.seek(0)

    # Cache timeout set to 3 seconds, which seems like enough time for the user
    # to change a paremeter and try to download again, but prevents spamming.
    return send_file(buff, as_attachment=True,
                     attachment_filename="all_plots_toml.zip",
                     cache_timeout=3)


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


@endpoint_models.route('/models', methods=["DELETE"])
def clear():
    """Deletes all models from the session
    DELETE /models

    Parameters: None

    Returns:
    - {"model_names": <list_of_model_names_in_session>}
    """
    session["models"] = pickle.dumps({})
    res = {"model_names": get_model_names()}
    return jsonify(res)
