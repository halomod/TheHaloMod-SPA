"""Tests for the /models endpoint"""

from halomod import TracerHaloModel
import pickle

# GET
def test_get_names(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": {}, "AnotherModel": {}})
    response = client.get('/models', json={
        "dataType": "names",
    })
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
