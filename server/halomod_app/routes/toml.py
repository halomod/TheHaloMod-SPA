
from flask import Blueprint, session, send_file
import pickle
import zipfile
import io
from hmf.helpers.cfg_utils import framework_to_dict
import toml

toml_bp = Blueprint('toml', __name__)


@toml_bp.route('/', methods=['GET'], strict_slashes=False)
def toml_route():
    """ Builds and sends a toml file for each model in the user's session in a
    zip folder.

    get:
      responses:
        200:
          description: "Returns the zip file containining the different toml files for each model in the user's session"
          content:
            application/zip:
    """
    models = None
    if 'models' in session:
        models = pickle.loads(session.get("models"))
    else:
        models = {}

    # Open up file-like objects for response
    buff = io.BytesIO()
    archive = zipfile.ZipFile(buff, "w", zipfile.ZIP_DEFLATED)

    for label, object in models.items():
        s = io.BytesIO()
        s.write(toml.dumps(framework_to_dict(object)).encode())
        archive.writestr(f"{label}.toml", s.getvalue())
        s.close()

    archive.close()

    # Reset the location of the buffer to the beginning
    buff.seek(0)

    # Cache timeout set to 3 seconds, which seems like enough time for the user
    # to change a paremeter and try to download again, but prevents spamming.
    return send_file(buff, as_attachment=True,
                     attachment_filename="all_plots_toml.zip",
                     cache_timeout=3)
