"""Plotting and driving utilities for TheHaloMod-SPA."""

import logging
from flask import session
from typing import Union
from halomod import TracerHaloModel
from halomod.wdm import HaloModelWDM
import re
import codecs
import pickle
import json
from os import path, mkdir
import threading

logger = logging.getLogger(__name__)

# Generate a semaphore to only allow model creation one at a time across
# requests
modelCreationSem = threading.Semaphore()


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


def get_initial_model() -> TracerHaloModel:
    """Gets the initial high-resolution model for the application to make
    copies off of for new models.

    This makes subsequent model creation much faster.
    """
    # Intiialize the initial model variable
    initial_model = None

    # Check if the high-definition model has already been created previously
    file_directory = './generated/'
    file_name = 'high_def_model.pkl'
    high_def_file_path = file_directory + file_name
    if path.exists(high_def_file_path):
        print('High definition model already exists, loading from file.')
        with open(high_def_file_path, 'rb') as high_def_file:
            initial_model = pickle.load(high_def_file)
    else:
        print('Beginning initial model creation. This might take a bit...')
        initial_model = TracerHaloModel(rmax=150, rnum=200, transfer_params={
                                        "kmax": 1e3, 'extrapolate_with_eh': True})
        print('Done creating the high resolution initial model. Now saving' +
              ' the model to ' + high_def_file_path + ' for later use.')

        mkdir(file_directory)
        with open(high_def_file_path, 'xb') as high_def_file:
            pickle.dump(initial_model, high_def_file, pickle.HIGHEST_PROTOCOL)
        print('Done saving the high resolution model to file.')

    return initial_model
