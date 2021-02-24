from flask import Blueprint, jsonify
from halomod import TracerHaloModel
import jsonpickle
import json
import hmf

# Get default values
default_model = TracerHaloModel.get_all_parameter_defaults()

# Turn the default model into a JSON object
default_model_string = jsonpickle.encode(default_model, unpicklable=False)
default_model_json = json.loads(default_model_string)

# Build the defaults
hmf_defaults = {
    'cosmo': {}
}

# The different cosmological variants in HMF. This could be refactored
# somewhere more visible / configurable in case they change.
cosmo_choices = [
    "Planck15",
    "Planck13",
    "WMAP9",
    "WMAP7",
    "WMAP5"
]

# Build the models so that the constants can be pulled
for choice in cosmo_choices:
    cosmo_model = hmf.cosmo.Cosmology(cosmo_model=getattr(hmf.cosmo, choice))
    hmf_defaults.get('cosmo').setdefault(choice, {
        "H0": cosmo_model.cosmo.H0.value,
        "Ob0": cosmo_model.cosmo.Ob0,
        "Om0": cosmo_model.cosmo.Om0
    })

constantsBP = Blueprint('constants', __name__)


@constantsBP.route('/constants', methods=["GET"])
def constants():
    """
    Returns a json representation that holds the two sets of constants
    at the moment.
    """
    return jsonify({
        "defaultModel": default_model_json,
        "constantsFromHMF": hmf_defaults
    })
