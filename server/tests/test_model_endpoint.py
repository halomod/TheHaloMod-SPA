"""Tests for the /model endpoint"""

from halomod import TracerHaloModel
import pickle

# POST
def test_create(client, create_payload):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.post('/model', json=create_payload)
    assert response is not None
    assert response.status_code == 200
    json_response = response.json
    assert "model_names" in json_response
    assert "TheModel" in json_response["model_names"]
    assert "THE_BEST_MODEL_EVER" in json_response["model_names"]

# PUT
def test_update(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.put('/model',
                           json={"model_name": "TheModel", "params": {}})
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert "TheModel" in names

# DELETE
def test_delete(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.delete('/model', json={"model_name": "TheModel"})
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert "TheModel" not in names

# PATCH
def test_rename(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.patch('/model', json={
        "model_name": "TheModel",
        "new_model_name": "NewModel"
    })
    assert response is not None
    assert response.status_code == 200
    assert "model_names" in response.json
    names = response.json["model_names"]
    assert "TheModel" not in names
    assert "NewModel" in names
