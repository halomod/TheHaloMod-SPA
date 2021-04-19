"""Plotting and driving utilities for TheHaloMod-SPA."""

import io
import logging
from flask import session
from typing import Union
from halomod import TracerHaloModel
from halomod.wdm import HaloModelWDM
import re
import codecs
import pickle
import json

logger = logging.getLogger(__name__)


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
    elif "wdm_model" in kwargs or "wdm_mass" in kwargs and not isinstance(previous, HaloModelWDM):
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
