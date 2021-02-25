from flask import Blueprint, jsonify
from halomod import TracerHaloModel
from hmf._internals import Component, get_base_components
from hmf.cosmology import Cosmology
import numpy as np
from astropy.cosmology import FlatLambdaCDM
from contextlib import redirect_stdout


def generate_constants() -> dict:
    """Builds the constants that a front-end can use to build forms or interactive
    pages for the calculations in HMF.

    This should be ran once on server startup."""

    backend_constants = {}

    # Caputer the no attribute print statements from
    # `get_all_parameter_defaults`.
    with redirect_stdout():
        defaults = TracerHaloModel.get_all_parameter_defaults()

    for k, v in defaults.items():
        # SKip the component parameters for now.
        if k.endswith('_params'):
            continue

        if np.issubclass_(v, Component):
            # Save class names, not the classes themselves.
            backend_constants[k] = v.__name__
        elif isinstance(v, FlatLambdaCDM):
            # Cosmology is weird, treat differently
            backend_constants[k] = v.name
        else:
            backend_constants[k] = v

    # Now find all the parameters for all the component models.
    for cmp in get_base_components():
        models = cmp.get_models()
        this = backend_constants[cmp.__name__ + "_params"] = {}

        if cmp == Cosmology:
            # Corner case: doesn't have _defaults :-(
            for name in ['Tcmb0', 'Neff', 'm_nu', 'H0', 'Om0']:
                this[name] = getattr(defaults['cosmo_model'], name)
        else:
            for name, model in models.items():
                if hasattr(model, "_defaults"):
                    backend_constants[cmp.__name__ + "_params"][name] = model._defaults

    return backend_constants


backend_constants = generate_constants()


constants_bp = Blueprint('constants', __name__)


@constants_bp.route('/', methods=["GET"], strict_slashes=False)
def constants():
    """
    Returns a json representation that holds the constants of HMF.
    """

    return jsonify({
        "backend_constants": backend_constants
    })
