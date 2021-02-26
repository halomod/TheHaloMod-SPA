import pickle
from halomod import TracerHaloModel


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
