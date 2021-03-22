"""Tests for the /models endpoint"""

from halomod import TracerHaloModel
import pickle

# GET
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

# GET
# TODO add ascii test

# PUT
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

# DELETE
def test_delete(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.post('/delete', json={"model_name": "TheModel"})
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert "TheModel" not in names
