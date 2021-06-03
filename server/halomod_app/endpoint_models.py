from flask import Blueprint
from flask import jsonify, request, session, send_file
from .utils import get_model_names, modelCreationSem, get_initial_model, hmf_driver
from hmf.helpers.cfg_utils import framework_to_dict
import toml
import dill as pickle
import zipfile
import io

endpoint_models = Blueprint('endpoint_models', __name__)


@endpoint_models.route('/models/names', methods=["GET"])
def get_models_data_names():
    """Returns the names of all the models associated with the current session
    GET /models

    Returns:
    - {"model_names": <list_of_model_names_in_session>}
    """
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
                     download_name="all_plots_toml.zip",
                     max_age=3)


@endpoint_models.route('/models', methods=['POST'])
def create():
    """Creates multiple models at once and returns the resultant list of names
    for the session
    POST /models

    Parameters:
    ```
    [
        {
            "params": <dictionary_of_params>,
            "label": <model_name>
        },
        {
            # the same as above for another model, etc.
        }
    ]
    ```

    Returns:
    - model_names: string[]
    - example: `{"model_names": <list_of_model_names_in_session>}`
    """

    new_models = request.get_json()['data']

    models = None
    if 'models' in session:
        models = pickle.loads(session.get('models'))
    else:
        models = {}

    initial_model = get_initial_model()

    # Only allow one model to be created at a time. Prevents crashes in the
    # server from Fortran when two models are created at the same time.
    modelCreationSem.acquire()

    num_models = len(models)
    for model_data in new_models:
        params = model_data['params']
        label = model_data['label']
        models[label] = hmf_driver(
            previous=initial_model,
            **params)  # creates model from params

    modelCreationSem.release()

    if num_models < len(models):
        session["models"] = pickle.dumps(models)  # writes updated model dict to session
    else:
        raise Exception("Model not computed.")

    return jsonify({"model_names": get_model_names()})


@endpoint_models.route('/models', methods=["PUT"])
def clone():
    """Clone model
    PUT /models

    Parameters:
    {
        "model_name": <model_name_to_clone>,
        "new_model_name": <name_for_new_model>
    }

    Returns:
    - {"model_names": <list_of_model_names_in_session>}
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
