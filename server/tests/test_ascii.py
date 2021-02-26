import pickle
import zipfile
import io
from halomod import TracerHaloModel


def test_ascii(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.get('/ascii')
    assert response is not None
    assert response.status_code == 200
    returnFile = io.BytesIO(response.data)
    assert zipfile.is_zipfile(returnFile)
