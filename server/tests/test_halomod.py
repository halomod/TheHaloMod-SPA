"""Houses the tests for the server."""

from halomod import TracerHaloModel

"""
def test_home(client):
    response = home(client)
    assert response.json['start'] == 'This is the HaloModApp'


def test_toml(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.get('/toml')
    assert response is not None
    assert response.status_code == 200
    returnFile = io.BytesIO(response.data)
    assert zipfile.is_zipfile(returnFile)


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
    response = client.post('/update',
                           json={"model_name": "TheModel", "params": {}})
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


def home(client):
    return client.get('/')
"""