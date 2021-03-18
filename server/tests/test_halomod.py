"""Houses the tests for the server."""

import imghdr
import base64
from halomod import TracerHaloModel
import pickle
import io
import zipfile


def test_home(client):
    response = home(client)
    assert response.json['start'] == 'This is the HaloModApp'


def test_get_names(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": {}, "AnotherModel": {}})
    response = client.get('/get_names')
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert "TheModel" in names
    assert "AnotherModel" in names


def test_clone(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.post('/clone', json={
        "model_name": "TheModel",
        "new_model_name": "NewModel"
    })
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert "TheModel" in names
    assert "NewModel" in names


def test_rename(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.post('/rename', json={
        "model_name": "TheModel",
        "new_model_name": "NewModel"
    })
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert "TheModel" not in names
    assert "NewModel" in names


def test_update(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.post('/update', json={"model_name": "TheModel", "params": {}})
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert "TheModel" in names


def test_delete(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.post('/delete', json={"model_name": "TheModel"})
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert "TheModel" not in names


def test_clear(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({
            "TheModel": TracerHaloModel(),
            "AnotherModel": TracerHaloModel(),
            "AndAnotherOne": TracerHaloModel()})
    response = client.post('/clear')
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert not names


def test_get_plot_data(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.post('/get_plot_data', json={"x": "m", "y": "dndm"})
    assert "plot_data" in response.json
    assert "TheModel" in response.json["plot_data"]


def test_get_object_data(client):
    params = ["m", "k", "r", "k_hm"]
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.post('/get_object_data', json={"param_names": params})
    assert "TheModel" in response.json
    for param in params:
        assert param in response.json["TheModel"]
        assert response.json["TheModel"][param]


def test_constants(client):
    response = client.get('/constants')
    assert response is not None
    assert response.status_code == 200
    assert "cosmo_defaults" in response.json


def test_create(client, create_payload):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.post('/create', json=create_payload)
    assert response is not None
    assert response.status_code == 200
    json_response = response.json
    assert "model_names" in json_response
    assert "TheModel" in json_response["model_names"]
    assert "THE_BEST_MODEL_EVER" in json_response["model_names"]


def home(client):
    return client.get('/')
