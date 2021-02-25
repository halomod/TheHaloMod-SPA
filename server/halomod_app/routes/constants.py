from astropy.cosmology.core import Cosmology
from flask import Blueprint, jsonify
from halomod import TracerHaloModel
from hmf._internals import Component, get_base_components
import numpy as np
from astropy.cosmology.parameters import available as cosmo_options
from astropy.cosmology import FlatLambdaCDM
from contextlib import redirect_stdout
from io import StringIO
import hmf


def generate_constants() -> dict:
    """Builds the constants that a front-end can use to build forms or interactive
    pages for the calculations in HMF.

    Note that the constants for `z`, `n`, and `sigma_8` were previously set
    manually on the front-end. See https://github.com/halomod/TheHaloMod/blob/master/halomod_app/static/halomod_app/js/HideShowRules.js

    This should be ran once on server startup."""

    backend_constants = {}

    # Capture the "no attribute" print statements from
    # `get_all_parameter_defaults`.
    throw_away_string = StringIO()
    with redirect_stdout(throw_away_string):
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
    for component in get_base_components():
        models = component.get_models()
        this = backend_constants[component.__name__ + "_params"] = {}

        if component == Cosmology:
            # Corner case: doesn't have _defaults :-(
            for name in ['Tcmb0', 'Neff', 'm_nu', 'H0', 'Om0']:
                this[name] = getattr(defaults['cosmo_model'], name)
        else:
            for name, model in models.items():
                if hasattr(model, "_defaults"):
                    backend_constants[component.__name__ +
                                      "_params"][name] = model._defaults

    # Build the Cosmo defaults, because those are separate
    cosmo_defaults = {}

    # Build the models so that the constants can be pulled
    for choice in cosmo_options:

        # The below options do not work with HMF at this time it seems. It
        # crashes when they process. HMF version 3.3.4
        if choice == 'Planck18' or choice == 'Planck18_arXiv_v2':
            continue
        cosmo_model = hmf.cosmo.Cosmology(cosmo_model=getattr(hmf.cosmo, choice))
        cosmo_defaults.setdefault(choice, {
            "H0": cosmo_model.cosmo.H0.value,
            "Ob0": cosmo_model.cosmo.Ob0,
            "Om0": cosmo_model.cosmo.Om0
        })

    backend_constants.setdefault('cosmo_defaults', cosmo_defaults)

    return backend_constants


backend_constants = generate_constants()


constants_bp = Blueprint('constants', __name__)


@constants_bp.route('/', methods=["GET"], strict_slashes=False)
def constants():
    """
    Returns a json representation that holds the constants of HMF.
    """

    return jsonify(backend_constants)
