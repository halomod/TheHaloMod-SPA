"""Tests for the /models endpoint"""

from halomod import TracerHaloModel
import pickle
import io
import zipfile
import json

# GET


def test_get_names(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": {}, "AnotherModel": {}})
    response = client.get('/models/names')
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert "TheModel" in names
    assert "AnotherModel" in names

# GET


def test_get_object_data(client):
    params = ["m", "k", "r", "k_hm"]
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})

    query_data = str()
    for param in params:
       query_data += str("param_names[]=") + str(param) + "&"
    
    response = client.get('/models/object', query_string=query_data)
    assert "TheModel" in json.loads(response.get_data(as_text=True))
    for param in params:
        assert param in json.loads(response.get_data(as_text=True))["TheModel"]
        assert json.loads(response.get_data(as_text=True))["TheModel"][param]

# GET


def test_toml(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.get('/models/toml')
    assert response is not None
    assert response.status_code == 200
    returnFile = io.BytesIO(response.data)
    assert zipfile.is_zipfile(returnFile)

# PUT


def test_clone(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.put('/models', json={
        "model_name": "TheModel",
        "new_model_name": "NewModel"
    })
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert "TheModel" in names
    assert "NewModel" in names

# DELETE


def test_clear(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({
            "TheModel": TracerHaloModel(),
            "AnotherModel": TracerHaloModel(),
            "AndAnotherOne": TracerHaloModel()})
    response = client.delete('/models')
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert not names
