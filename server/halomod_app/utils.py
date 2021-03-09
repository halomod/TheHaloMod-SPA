"""Plotting and driving utilities for TheHaloMod-SPA."""

import io
import logging
from typing import Union, Dict
import matplotlib.ticker as tick
from flask import session

from halomod import TracerHaloModel
from halomod.wdm import HaloModelWDM
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.backends.backend_pdf import FigureCanvasPdf
from matplotlib.backends.backend_svg import FigureCanvasSVG
from matplotlib.figure import Figure
import re
import codecs
import pickle
import json

import numpy as np

# Documentation on the built-in cosmologies:
# https://docs.astropy.org/en/stable/cosmology/index.html#built-in-cosmologies
from astropy.cosmology.parameters import available as cosmo_options
from astropy.cosmology import FlatLambdaCDM
from contextlib import redirect_stdout
from io import StringIO
import hmf
from astropy.cosmology.core import Cosmology
from hmf._internals import Component, get_base_components


logger = logging.getLogger(__name__)

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


def get_model_names():
    """Helper function that abstracts logic for getting names of all models
    associated with the function"""
    if 'models' in session:
        models = pickle.loads(session.get('models'))
    else:
        models = {}
    return list(models.keys())


def hmf_driver(cls=TracerHaloModel,
               previous: Union[None, TracerHaloModel] = None, **kwargs):
    if previous is None:
        return cls(**kwargs)
    elif "wdm_model" in kwargs and not isinstance(previous, HaloModelWDM):
        return HaloModelWDM(**kwargs)
    elif "wdm_model" not in kwargs and isinstance(previous, HaloModelWDM):
        return TracerHaloModel(**kwargs)
    else:
        this = previous.clone(**kwargs)

        # TODO: this is a hack, and should be fixed in hmf
        # we have to set all _params whose model has been changed to {}
        # so that they don't get carry-over parameters from other models.
        for k, v in kwargs.items():
            if k.endswith("model") and v != getattr(this, k).__class__.__name__:
                this.update(**{k.replace("model", "params"): {}})

        return this


MLABEL = r"Mass $(M_{\odot}h^{-1})$"
KLABEL = r"Wavenumber, $k$ [$h$/Mpc]"
RLABEL = r"Scale, $r$ [Mpc/$h$]"
KHMLABEL = r"Fourier Scale, $k$ [$h$/Mpc]"

XLABELS = {"m": MLABEL, "k": KLABEL, "r": RLABEL, "k_hm": KHMLABEL}

KEYMAP = {
    "dndm": {
        "xlab": MLABEL,
        "ylab": r"Mass Function $\left( \frac{dn}{dM} \right) h^4 Mpc^{-3}M_\odot^{-1}$",
        "yscale": "log",
    },
    "dndlnm": {
        "xlab": MLABEL,
        "ylab": r"Mass Function $\left( \frac{dn}{d\ln M} \right) h^3 Mpc^{-3}$",
        "yscale": "log",
    },
    "dndlog10m": {
        "xlab": MLABEL,
        "ylab": r"Mass Function $\left( \frac{dn}{d\log_{10}M} \right) h^3 Mpc^{-3}$",
        "yscale": "log",
    },
    "fsigma": {
        "xlab": MLABEL,
        "ylab": r"$f(\sigma) = \nu f(\nu)$",
        "yscale": "linear",
    },
    "ngtm": {"xlab": MLABEL, "ylab": r"$n(>M) h^3 Mpc^{-3}$", "yscale": "log"},
    "rho_gtm": {
        "xlab": MLABEL,
        "ylab": r"$\rho(>M)$, $M_{\odot}h^{2}Mpc^{-3}$",
        "yscale": "log",
    },
    "rho_ltm": {
        "xlab": MLABEL,
        "ylab": r"$\rho(<M)$, $M_{\odot}h^{2}Mpc^{-3}$",
        "yscale": "linear",
    },
    "how_big": {"xlab": MLABEL, "ylab": r"Box Size, $L$ Mpc$h^{-1}$", "yscale": "log", },
    "sigma": {"xlab": MLABEL, "ylab": r"Mass Variance, $\sigma$", "yscale": "linear", },
    "lnsigma": {"xlab": MLABEL, "ylab": r"$\ln(\sigma^{-1})$", "yscale": "linear"},
    "n_eff": {
        "xlab": MLABEL,
        "ylab": r"Effective Spectral Index, $n_{eff}$",
        "yscale": "linear",
    },
    "power": {"xlab": KLABEL, "ylab": r"$P(k)$, [Mpc$^3 h^{-3}$]", "yscale": "log"},
    "transfer_function": {
        "xlab": KLABEL,
        "ylab": r"$T(k)$, [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "delta_k": {"xlab": KLABEL, "ylab": r"$\Delta(k)$", "yscale": "log"},
    "halo_bias": {"xlab": MLABEL, "ylab": "Halo Bias", "yscale": "log"},
    "cmz_relation": {"xlab": MLABEL, "ylab": "Halo Concentration", "yscale": "log", },
    "corr_auto_tracer": {
        "xlab": RLABEL,
        "ylab": r"Tracer correlation, $\xi_{2h}(r)$",
        "yscale": "log",
    },
    "corr_2h_auto_tracer": {
        "xlab": RLABEL,
        "ylab": r"2-halo tracer correlation, $\xi_{2h}(r)$",
        "yscale": "log",
    },
    "corr_1h_auto_tracer": {
        "xlab": RLABEL,
        "ylab": r"1-halo tracer correlation, $\xi_{1h}(r)$",
        "yscale": "log",
    },
    "corr_1h_cs_auto_tracer": {
        "xlab": RLABEL,
        "ylab": r"1-halo central-sallite tracer correlation, $\xi_{1h}^{cs}(r)$",
        "yscale": "log",
    },
    "corr_1h_ss_auto_tracer": {
        "xlab": RLABEL,
        "ylab": r"1-halo satellite-sallite tracer correlation, $\xi_{1h}^{ss}(r)$",
        "yscale": "log",
    },
    "corr_linear_mm": {
        "xlab": RLABEL,
        "ylab": r"Linear matter correlation, $\xi_{m}^{\rm lin}(r)$",
        "yscale": "log",
    },
    "corr_1h_auto_matter": {
        "xlab": RLABEL,
        "ylab": r"1-halo matter correlation, $\xi_{1h}(r)$",
        "yscale": "log",
    },
    "corr_2h_auto_matter": {
        "xlab": RLABEL,
        "ylab": r"2-halo matter correlation, $\xi_{2h}(r)$",
        "yscale": "log",
    },
    "corr_1h_cross_tracer_matter": {
        "xlab": RLABEL,
        "ylab": r"1-halo matter-tracer correlation, $\xi_{1h}^{m\times T}(r)$",
        "yscale": "linear",
    },
    "corr_2h_cross_tracer_matter": {
        "xlab": RLABEL,
        "ylab": r"2-halo matter-tracer correlation, $\xi_{2h}^{m\times T}(r)$",
        "yscale": "log",
    },
    "corr_auto_matter": {
        "xlab": RLABEL,
        "ylab": r"Matter correlation, $\xi_{mm}(r)$",
        "yscale": "log",
    },
    "corr_cross_tracer_matter": {
        "xlab": RLABEL,
        "ylab": r"Matter-tracer correlation, $\xi_{m\times T}(r)$",
        "yscale": "log",
    },
    "sd_bias_correction": {
        "xlab": RLABEL,
        "ylab": "Scale-dependent bias correction",
        "yscale": "linear",
    },
    "central_occupation": {
        "xlab": MLABEL,
        "ylab": "Central Tracer Occupation",
        "yscale": "log",
    },
    "satellite_occupation": {
        "xlab": MLABEL,
        "ylab": "Satellite Tracer Occupation",
        "yscale": "log",
    },
    "total_occupation": {
        "xlab": MLABEL,
        "ylab": "Total Tracer Occupation",
        "yscale": "log",
    },
    "power_2h_auto_matter": {
        "xlab": KHMLABEL,
        "ylab": r"2-halo matter $P_{mm}^{2h}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "power_1h_auto_matter": {
        "xlab": KHMLABEL,
        "ylab": r"1-halo matter $P_{mm}^{1h}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "power_auto_matter": {
        "xlab": KHMLABEL,
        "ylab": r"2-halo matter $P_{mm}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "power_auto_tracer": {
        "xlab": KHMLABEL,
        "ylab": r"Tracer $P_{TT}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "power_1h_auto_tracer": {
        "xlab": KHMLABEL,
        "ylab": r"1-halo tracer $P_{TT}^{1h}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "power_2h_auto_tracer": {
        "xlab": KHMLABEL,
        "ylab": r"2-halo tracer $P_{TT}^{2h}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "power_1h_cs_auto_tracer": {
        "xlab": KHMLABEL,
        "ylab": r"1-halo cen-sat tracer $P_{TT}^{1h, cs}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "power_1h_ss_auto_tracer": {
        "xlab": KHMLABEL,
        "ylab": r"1-halo sat-sat tracer $P_{TT}^{1h, ss}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "power_1h_cross_tracer_matter": {
        "xlab": KHMLABEL,
        "ylab": r"1-halo matter-tracer $P_{m\times T}^{1h}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "power_2h_cross_tracer_matter": {
        "xlab": KHMLABEL,
        "ylab": r"2-halo matter-tracer $P_{m\times T}^{2h}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "power_cross_tracer_matter": {
        "xlab": KHMLABEL,
        "ylab": r"Matter-tracer $P_{m\times T}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "nonlinear_delta_k": {
        "xlab": KLABEL,
        "ylab": r"$\Delta^2_{\rm halofit}(k)$",
        "yscale": "log",
    },
    "nonlinear_power": {
        "xlab": KLABEL,
        "ylab": r"$P_{\rm halofit}(k)$ [Mpc$^3 h^{-3}$]",
        "yscale": "log",
    },
    "radii": {"xlab": MLABEL, "ylab": r"Radius [Mpc/$h$]", "yscale": "log", },
    "tracer_cmz_relation": {
        "xlab": MLABEL,
        "ylab": r"Tracer Concentration",
        "yscale": "log",
    },
}


def camel_to_words(word: str) -> str:
    n = len(word)
    word = re.sub(r"(?<!^)(?=[A-Z])", " ", word)
    if len(word.split(" ")) == n:
        return word.replace(" ", "")
    return word


def serialize_model(model) -> str:
    return codecs.encode(pickle.dumps(model), "base64").decode()


def deserialize_model(serialized_model):
    return pickle.loads(codecs.decode(serialized_model.encode(), "base64"))


def load_json(file_location):
    with open(file_location) as json_file:
        return json.load(json_file)
