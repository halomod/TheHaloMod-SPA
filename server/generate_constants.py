from io import StringIO
from typing import Union, Dict
import numpy as np
import json
# Documentation on the built-in cosmologies:
# https://docs.astropy.org/en/stable/cosmology/index.html#built-in-cosmologies
from astropy.cosmology.parameters import available as cosmo_options
from astropy.cosmology import FlatLambdaCDM
from contextlib import redirect_stdout
from io import StringIO, open
import hmf
from astropy.cosmology.core import Cosmology
from hmf._internals import Component, get_base_components
from halomod import TracerHaloModel

# Types
ParameterName = str
ModelName = str
BackendConstantsKey = Union[ParameterName, ModelName]
Model = Union[object, None]
Parameters = Union[dict, bool, int, float, str]
BackendConstantsValue = Union[Model, Parameters]
BackendConstants = Dict[BackendConstantsKey, BackendConstantsValue]

def generate_constants() -> BackendConstants:
    """Builds the constants that a front-end can use to build forms or interactive
    pages for the calculations in HMF.

    Note that the constants for `z`, `n`, and `sigma_8` were previously set
    manually on the front-end. See https://github.com/halomod/TheHaloMod/blob/master/halomod_app/static/halomod_app/js/HideShowRules.js

    This should be ran once on server startup.

    Following format is OpenAPI 3.0. Very standard in API writing for REST style endpoints.

    get:
      responses:
        200:
          description: "Returns the backend constants as a JSON object"
          content:
            application/json:
              schema:
                description: "The built constants object. It has many different possible types for each key, but it generally either has `componentType_params` then the params for that component, or `componentType_model` and the chosen model name for that component."
                type: object
                addtionalProperties:
                  type:
                  - object
                  - bool
                  - number
                  - str
                  - null
    """

    backend_constants = {}

    # Capture the "no attribute" print statements from
    # `get_all_parameter_defaults`.
    throw_away_string = StringIO()
    with redirect_stdout(throw_away_string):
        tracer_halo_defaults = TracerHaloModel.get_all_parameter_defaults()

    for params_or_model_name, params_or_model_value in tracer_halo_defaults.items():
        # SKip the component parameters for now.
        if params_or_model_name.endswith('_params'):
            continue

        if np.issubclass_(params_or_model_value, Component):
            # Save class names, not the classes themselves.
            backend_constants[params_or_model_name] = params_or_model_value.__name__
        elif isinstance(params_or_model_value, FlatLambdaCDM):
            # Cosmology is weird, treat differently
            backend_constants[params_or_model_name] = params_or_model_value.name
        else:
            backend_constants[params_or_model_name] = params_or_model_value

    # Now find all the parameters for all the component models.
    for component in get_base_components():
        models = component.get_models()
        current_component_params = backend_constants[component.__name__ + "_params"] = {}

        if component == Cosmology:
            # Corner case: doesn't have _defaults :-(
            for name in ['Tcmb0', 'Neff', 'm_nu', 'H0', 'Om0']:
                current_component_params[name] = getattr(
                    tracer_halo_defaults['cosmo_model'], name)
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

with open('./backend_constants.json', 'w') as fp:
    json.dump(generate_constants(), fp)

