"""Houses the tests for the server."""

from halomod import TracerHaloModel
import pickle


def test_home(client):
    response = home(client)
    assert response.json['start'] == 'This is the HaloModApp'


def test_get_object_data(client):
    params = ["m", "k", "r", "k_hm"]
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.post('/get_object_data', json={"param_names": params})
    assert "TheModel" in response.json
    for param in params:
        assert param in response.json["TheModel"]
        assert response.json["TheModel"][param]


def home(client):
    return client.get('/')
