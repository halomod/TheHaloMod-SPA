from sentry_sdk.integrations.flask import FlaskIntegration
import sentry_sdk
from werkzeug.exceptions import HTTPException
from flask_session import Session
from flask_cors import CORS
from flask import Flask, jsonify, request, session, abort, send_file
from . import utils
from halomod_app.utils import get_model_names
from hmf.helpers.cfg_utils import framework_to_dict
import toml
import json
import dill as pickle
import zipfile
import io
import base64

sess = Session()


def create_app(test_config=None):
    """Acts as the main entrypoint for the server. Builds the Flask app and
    the routes."""

    # add sentry sdk
    sentry_sdk.init(
        dsn="https://27537774b9d949b7ab5dcbe3ba4496c9@o516709.ingest.sentry.io/5624184",
        integrations=[FlaskIntegration()],

        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=1.0,

        # By default the SDK will try to use the SENTRY_RELEASE
        # environment variable, or infer a git commit
        # SHA as release, however you may want to set
        # something more human-readable.
        # release="myapp@1.0.0",
    )
    app = Flask(__name__, instance_relative_config=True)

    # Everything in config.py Config class is loaded into the Flask app config
    app.config.from_object('config.Config')

    CORS(app, origins="http://localhost:*", supports_credentials=True)  # enable CORS
    sess.init_app(app)  # enable Sessions

    # Generic Exception handler for 500 Internal Server Error
    # Returns manually formatted JSON response object with 500 code,
    # exception name, and description

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        # pass HTTPExceptions to HTTPException handler
        if isinstance(e, HTTPException):
            return e

        response = {}
        description = ""
        if hasattr(e, 'description'):
            description = e.description
        elif hasattr(e, 'args'):
            description = e.args
        else:
            description = 'Error has no description'

        # replace the body with JSON
        response.setdefault('data', json.dumps({
            "code": '500',
            "name": e.name if hasattr(e, 'name') else str(type(e)),
            "description": description,
        }))
        response.setdefault('content_type', "application/json")
        return response

    @app.errorhandler(HTTPException)
    def handle_exception(e):
        """HTTP Exception Handler for error codes 400-499.

        Returns JSON object with error code, exception name, and description"""
        # start with the correct headers and status code from the error
        response = e.get_response()
        # replace the body with JSON
        response.data = json.dumps({
            "code": e.code,
            "name": e.name,
            "description": e.description,
        })
        response.content_type = "application/json"
        return response

    @app.route('/')
    def home():
        return jsonify({"start": 'This is the HaloModApp'})

    @app.route('/create', methods=["POST"])
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
    # expects: {"x": <choice_from_PLOT_AXIS_METADATA>, "y": <choice_from_PLOT_AXIS_METADATA>, "model_names": <array_of_model_names_to_consider> }
    # outputs: {"plot_details":
    #             {"xlab": <str_xlabel>, "ylab": <str_ylabel>, "yscale": <str_yscale>},
    #          "plot_data": {
    #              <model_label>: {"xs": <array_of_xs>, "ys": <array_of_ys>},
    #              ...
    #           }}

    @app.route('/get_plot_data', methods=["POST"])
    def get_plot_data():
        res = {"plot_data": {}}
        request_json = request.get_json()
        x_param = request_json["x"]
        y_param = request_json["y"]

        models = None
        if 'models' in session:
            models = pickle.loads(session.get("models"))
        else:
            models = {}
        # if model_names in json use those else use all
        names = request_json["model_names"] if "model_names" in request_json else list(
            models.keys())

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
                abort(
                    400, f"Error encountered getting {y_param} for model {name}. {str(e)}.")
                print(f"Error encountered getting {y_param} for model {name}")
                print(e)

            res["plot_data"][name] = data  # put data in response object

        # save post-calculation models to session to take advantage of compute
        session["models"] = pickle.dumps(models)

        return jsonify(res)

    # This endpoint renames a model based on name and new name
    #
    # expects: {"model_name": <model_name_to_rename>, "new_model_name": <new_model_name>}
    # outputs: {"model_names": <list_of_model_names_in_session>}
    @app.route('/rename', methods=["POST"])
    def rename():

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

    # This endpoint clears all models from the session
    #
    # expects: None
    # outputs: {"model_names": <list_of_model_names_in_session>}
    @app.route('/clear', methods=["POST"])
    def clear():
        session["models"] = pickle.dumps({})
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

    @app.route('/get_object_data', methods=['POST'])
    def get_object_data():
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

    @app.route('/toml', methods=['GET'])
    def toml_route():
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

    return app
