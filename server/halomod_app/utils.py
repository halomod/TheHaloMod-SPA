"""Plotting and driving utilities for TheHaloMod-SPA."""

import io
import logging
from typing import Union
import matplotlib.ticker as tick
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


logger = logging.getLogger(__name__)


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
