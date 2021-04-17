from flask import Blueprint
from flask_session import Session
from flask_mail import mail
import io
import toml
import numpy as np
from hmf.helpers.cfg_utils import framework_to_dict

endpoint_bugs = Blueprint('endpoint_bugs', __name__)


@endpoint_bus.route('/bugs', methods=["POST"])
def report_bug():
    model_name = request.get_json()["model_name"]
    bug_details = request.getjson()["bug_details"]

    models = None
    if 'models' in session:
        models = pickle.loads(session.get('models'))
    else:
        models = {}

    buggy_model = models[model_name]
    mail = Mail()


def build_toml(model):
    buff = io.BytesIO()
    buff.write(toml.dumps(framework_to_dict(model)),
                          encoder=toml.TomlNumpyEncoder()).encode())