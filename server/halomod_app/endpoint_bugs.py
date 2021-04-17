from flask import Blueprint
from flask_session import Session
from flask_mail import mail, Message
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

    if model_name in models:
        buggy_model = models[model_name]
    else:
        return 404

    mail = Mail()

    str_msg = f"User's name: ${bug_details.bugContactName}\n"
    str_msg += f"User's email: ${bug_details.bugContactEmail}\n"
    str_msg += f"Description: ${bug_details.bugText}"

    msg = Message(str_msg, subject=f"[THM Bug Report] Bug in {model_name}")
    msg.attach(f"{model_name}.toml", "application/toml", build_toml(buggy_model))

    mail.send(msg)


def build_toml(model):
    buff = io.BytesIO()
    buff.write(toml.dumps(framework_to_dict(model)),
                          encoder=toml.TomlNumpyEncoder()).encode())
    return buff.getValue()