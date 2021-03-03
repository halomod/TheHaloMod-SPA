from halomod_app import utils
from flask import Blueprint, jsonify

plot_types_bp = Blueprint('plot_types', __name__)


@plot_types_bp.route('/', methods=["GET"], strict_slashes=False)
def get_plot_types():
    """This endpoint returns the details of all the different plot types that
    can be used to represent a halo model.

    expects: None
    outputs: {
        xLabels: <data from utils.py>,
        plotOptions: <data from KEYMAP in utils.py>
    }"""
    res = {
        'xLabels': utils.XLABELS,
        'plotOptions': utils.KEYMAP
    }
    return jsonify(res)
