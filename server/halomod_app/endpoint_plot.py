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

"""Generates a figure
POST /plot

Parameters:
    - fig_type: 
    - img_type: string
Returns:
- figure: b64_serialized_figure
"""
# Generates a figure using session data & matplotlib rendering and
# returns it to client
#
# expects: {"fig_type": <fig_type> (see utils.KEYMAP for options),
#           "image type": <format of returned image> (png, svg, etc...)}
# outputs {"figure": <b64_serialized_figure>}
@endpoint_plot.route('/plot', methods=["POST"])
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
