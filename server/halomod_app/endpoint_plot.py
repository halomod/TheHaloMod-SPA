from flask import Blueprint
from flask import jsonify, request, session, abort
from . import utils
import dill as pickle
import warnings
import sentry_sdk
from io import StringIO
from contextlib import redirect_stderr

endpoint_plot = Blueprint('endpoint_plot', __name__)

"""Get plot data
GET /plot

Parameters:
    - x: float
    - y: float
    - names: string[]
Returns:
- plot_data: dict
"""
# This endpoint returns plot data required for front-end plotting from session data
#
# expects: {"x": <choice_from_PLOT_AXIS_METADATA>, "y": <choice_from_PLOT_AXIS_METADATA>, "model_names": <array_of_model_names_to_consider> }
# outputs: {"plot_data": {
#              <model_label>: {"xs": <array_of_xs>, "ys": <array_of_ys>},
#              ...
#           }}
#
# Axis labels/scale aren't part of this response - the client derives those
# itself from PLOT_AXIS_METADATA.json rather than the server sending them.

# Whitelist of attributes the client is allowed to request via x/y. Without
# this, x_param/y_param went straight into getattr(model, ...) with no
# validation, letting a caller inspect arbitrary model internals (or trigger
# an expensive/unintended computed property) just by naming it in the query
# string. Keep this in sync with the keys of
# client/src/constants/PLOT_AXIS_METADATA.json, which is the client's own
# list of choices it will ever actually send.
PLOTTABLE_ATTRIBUTES = frozenset({
    'k', 'k_hm', 'r', 'm', 'central_occupation', 'cmz_relation',
    'corr_1h_auto_matter', 'corr_1h_auto_tracer', 'corr_1h_cross_tracer_matter',
    'corr_1h_cs_auto_tracer', 'corr_1h_ss_auto_tracer', 'corr_2h_auto_matter',
    'corr_2h_auto_tracer', 'corr_2h_cross_tracer_matter', 'corr_auto_matter',
    'corr_auto_tracer', 'corr_cross_tracer_matter', 'corr_linear_mm',
    'delta_k', 'dndlnm', 'dndlog10m', 'dndm', 'fsigma', 'halo_bias',
    'lnsigma', 'n_eff', 'ngtm', 'nonlinear_delta_k', 'nonlinear_power',
    'power', 'power_1h_auto_matter', 'power_1h_auto_tracer',
    'power_1h_cross_tracer_matter', 'power_1h_cs_auto_tracer',
    'power_1h_ss_auto_tracer', 'power_2h_auto_matter', 'power_2h_auto_tracer',
    'power_2h_cross_tracer_matter', 'power_auto_matter', 'power_auto_tracer',
    'power_cross_tracer_matter', 'radii', 'rho_gtm', 'rho_ltm',
    'satellite_occupation', 'sd_bias_correction', 'sigma',
    'total_occupation', 'tracer_cmz_relation', 'transfer_function',
})


@endpoint_plot.route('/plot', methods=["GET"])
def get_plot_data():
    # Disable Warnings behaving like Exceptions because,
    # If caught and released it interrupts the flow of hmf.

    res = {"plot_data": {}}
    x_param = request.args.get("x")
    y_param = request.args.get("y")

    if x_param not in PLOTTABLE_ATTRIBUTES or y_param not in PLOTTABLE_ATTRIBUTES:
        abort(400, "x and y must each be one of the supported plot attributes.")

    models = utils.get_models()
    # if model_names in json use those else use all
    names = request.args.getlist("model_names") if "model_names" in request.args else list(
        models.keys())

    for name in names:
        model = models[name]  # gets model with label <name>
        data = {}
        try:
            stdOut = ""
            # Sets up a temporary warnings filter that just prints the warnings to the
            # console
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
                        sentry_sdk.capture_message(
                            error[error.find("DeprecationWarning"):])
        except Exception as e:
            print(f"Error encountered getting {y_param} for model {name}")
            print(str(e))
            warnings.filterwarnings("error")
            raise (Exception(f"Error encountered getting {y_param} for model {name}"))

        res["plot_data"][name] = data  # put data in response object

    # save post-calculation models to session to take advantage of compute
    session["models"] = pickle.dumps(models)
    # warnings.filterwarnings("error")
    return jsonify(res)
