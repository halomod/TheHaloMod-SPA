from flask import Blueprint, request, session, current_app, Response
from flask_session import Session
import io
import os
import traceback
import yagmail
import toml
import numpy as np
import dill as pickle
from hmf.helpers.cfg_utils import framework_to_dict

endpoint_bugs = Blueprint('endpoint_bugs', __name__)


@endpoint_bugs.route('/bugs', methods=["POST"])
def report_bug():
    """
      Sends a model-specific bug reported by the user to the site's email

      expects:
        {
          "bug_details": {
            "bugContactName": <username>,
            "bugContactEmail: <user_email>,
            "bugDetails": <description_of_bug>
          },
          "model_name": <model's name>
        },
      returns:
        'Success' on success
        Server error on failure
    """
    # These need to be defined in config.py or through environment variables
    email = current_app.config["MAIL_USERNAME"]
    password = current_app.config["MAIL_PASSWORD"]

    model_name = request.get_json()["model_name"]
    bug_details = request.get_json()["bug_details"]

    models = None
    if 'models' in session:
        models = pickle.loads(session.get('models'))
    else:
        models = {}

    if model_name in models:
        buggy_model = models[model_name]
    else:
        return 'Model does not exist', 404

    body = f"User's name: {bug_details['bugContactName']}\n"
    body += f"User's email: {bug_details['bugContactEmail']}\n"
    body += f"Bug Description: {bug_details['bugText']}"

    with open('model.toml', 'wb') as file:
        file.write(build_toml(buggy_model))

    yag = yagmail.SMTP(user=email, password=password)
    yag.send(
        to=email,
        subject=f"[THM Bug Report] Bug in {model_name}",
        contents=body,
        attachments='./model.toml'
    )

    os.remove('model.toml')

    return 'Success'


def build_toml(model):
    buff = io.BytesIO()
    buff.write(toml.dumps(framework_to_dict(model),
                          encoder=toml.TomlNumpyEncoder()).encode())
    return buff.getvalue()
