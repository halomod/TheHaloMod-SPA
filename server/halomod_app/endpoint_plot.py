from flask import Blueprint
from flask import jsonify, request, session, abort
import dill as pickle

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
