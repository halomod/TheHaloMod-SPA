from flask import Blueprint
from flask import jsonify, request, session, abort
import dill as pickle
import warnings
import sentry_sdk
from io import StringIO
from contextlib import redirect_stdout, redirect_stderr
import sys

endpoint_plot = Blueprint('endpoint_plot', __name__)

"""Get plot data
GET /plot

Parameters:
    - x: float
    - y: float
    - names: string[]
Returns:
- plot_details: dict
- model_label: dict
"""
# This endpoint returns plot data required for front-end plotting from session data
#
# expects: {"x": <choice_from_PLOT_AXIS_METADATA>, "y": <choice_from_PLOT_AXIS_METADATA>, "model_names": <array_of_model_names_to_consider> }
# outputs: {"plot_details":
#             {"xlab": <str_xlabel>, "ylab": <str_ylabel>, "yscale": <str_yscale>},
#          "plot_data": {
#              <model_label>: {"xs": <array_of_xs>, "ys": <array_of_ys>},
#              ...
#           }}


@endpoint_plot.route('/plot', methods=["GET"])
def get_plot_data():
    # Disable Warnings behaving like Exceptions because, 
    # If caught and released it interrupts the flow of hmf.
    
    res = {"plot_data": {}}
    x_param = request.args.get("x")
    y_param = request.args.get("y")

    models = None
    if 'models' in session:
        models = pickle.loads(session.get("models"))
    else:
        models = {}
    # if model_names in json use those else use all
    names = request.args.getlist("model_names") if "model_names" in request.args else list(
        models.keys())

    for name in names:
        model = models[name]  # gets model with label <name>
        data = {}
        try:
            stdOut = ""
            # Sets up a temporary warnings filter that just prints the warnings to the console
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore")
                warnings.filterwarnings("always")
                # Capture stderr for later review
                with StringIO() as buf, redirect_stderr(buf):
                    ys = getattr(model, y_param)  # gets y array
                    xs = getattr(model, x_param)  # gets x array
                    stdOut = buf.getvalue().split("\n")
            
            mask = ys > 1e-40 * ys.max()  # creates mask as seen in create_canvas in utils
            data["ys"] = list(ys[mask])  # apply mask and save ys into data dict
            data["xs"] = list(xs[mask])  # apply mask and save xs into data dict
            
            for error in stdOut:
                if "UserWarning" in error:
                    print(error)
                    # Tell Sentry about the Warning
                    with sentry_sdk.push_scope() as scope:
                        scope.level = 'warning'
                        sentry_sdk.capture_message(error[error.find("UserWarning"):])
                if "DeprecationWarning" in error:
                    print(error)
                    # Tell Sentry about the Warning
                    with sentry_sdk.push_scope() as scope:
                        scope.level = 'warning'
                        sentry_sdk.capture_message(error[error.find("DeprecationWarning"):])
        except Exception as e:
            print(f"Error encountered getting {y_param} for model {name}")
            print(str(e))
            warnings.filterwarnings("error")
            raise(Exception(f"Error encountered getting {y_param} for model {name}"))

        res["plot_data"][name] = data  # put data in response object

    # save post-calculation models to session to take advantage of compute
    session["models"] = pickle.dumps(models)
    # warnings.filterwarnings("error")
    return jsonify(res)
