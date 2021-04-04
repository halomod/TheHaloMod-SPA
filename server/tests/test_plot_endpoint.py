"""Tests for the /plot endpoint"""

from halomod import TracerHaloModel
import pickle

# GET


def test_get_plot_data(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.get('/plot', json={"x": "m", "y": "dndm"})
    assert "plot_data" in response.json
    assert "TheModel" in response.json["plot_data"]

# POST


def test_get_object_data(client):
    params = ["m", "k", "r", "k_hm"]
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.post('/plot', json={"param_names": params})
    assert "TheModel" in response.json
    for param in params:
        assert param in response.json["TheModel"]
        assert response.json["TheModel"][param]
