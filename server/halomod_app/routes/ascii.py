from flask import Blueprint, session, send_file
import pickle
from halomod_app import utils
import numpy as np
import zipfile
import io

ascii_bp = Blueprint('ascii', __name__)


@ascii_bp.route('/', methods=['GET'], strict_slashes=False)
def ascii():
    """ Builds and sends the text data for each model stored in the session,
    which is then bundled into a zip file.

    get:
      responses:
        200:
          description: "Returns the zip file containining the different data files for each model in the user's session"
          content:
            application/zip:
    """
    models = None
    if 'models' in session:
        models = pickle.loads(session.get("models"))
    else:
        models = {}

    labels = list(models.keys())
    objects = list(models.values())

    # Open up file-like objects for response
    buff = io.BytesIO()
    archive = zipfile.ZipFile(buff, "w", zipfile.ZIP_DEFLATED)

    # Write out mass-based, k-based and r-based data files
    for index, object in enumerate(objects):
        for kind in utils.XLABELS:
            s = io.BytesIO()

            s.write(f"# [0] {utils.XLABELS[kind]}".encode())

            items = {
                k: utils.KEYMAP[k]["ylab"]
                for k in utils.KEYMAP
                if utils.KEYMAP[k]["xlab"] == utils.XLABELS[kind]
            }

            for j, (label, ylab) in enumerate(items.items()):
                if getattr(object, label) is not None:
                    s.write(f"# [{j+1}] {ylab}".encode())

            out = np.array(
                [getattr(object, kind)] + [
                    getattr(object, label)
                    for label in items
                    if getattr(object, label) is not None
                ]
            ).T
            np.savetxt(s, out)

            archive.writestr(f"{kind}Vector_test{labels[index]}.txt", s.getvalue())

            s.close()

    archive.close()

    # Reset the location of the buffer to the beginning
    buff.seek(0)

    # Cache timeout set to 3 seconds, which seems like enough time for the user
    # to change a paremeter and try to download again, but prevents spamming.
    return send_file(buff, as_attachment=True,
                     attachment_filename="all_plots.zip",
                     cache_timeout=3)
