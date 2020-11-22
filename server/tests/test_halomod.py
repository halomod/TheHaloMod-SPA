import os
import pytest
import json
import imghdr
import base64
from halomod import TracerHaloModel
import pickle
import codecs


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


def test_get_plot_data(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.get('/get_plot_data', json={"fig_type": "dndm"})
    assert "plot_details" in response.json
    assert "xlab" in response.json["plot_details"]
    assert "ylab" in response.json["plot_details"]
    assert "yscale" in response.json["plot_details"]

    assert "plot_data" in response.json
    assert "TheModel" in response.json["plot_data"]


def test_plot(client, plot_payload):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel(), "TheOtherModel": TracerHaloModel()})
    response = client.post('/plot', json={"fig_type": "dndm", "img_type": "png"})
    assert response is not None
    assert response.status_code == 200
    json_response = response.json
    assert "figure" in json_response

    # Decode
    base64_png = json_response['figure']
    base64_bytes = base64_png.encode('ascii')
    png_bytes = base64.b64decode(base64_bytes)

    # Check to make sure it is a png
    assert imghdr.what(None, h=png_bytes) == 'png'


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
