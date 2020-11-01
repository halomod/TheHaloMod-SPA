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


def test_plot(client, plot_payload):
    response = client.post('/plot', json=plot_payload)
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
    response = client.post('/create', json=create_payload)
    assert response is not None
    assert response.status_code == 200
    json_response = response.json
    assert 'THE_BEST_MODEL_EVER' in json_response

    serialized_model = json_response['THE_BEST_MODEL_EVER']
    deserialized_model = pickle.loads(codecs.decode(serialized_model.encode(), "base64"))

    assert isinstance(deserialized_model, TracerHaloModel)


def home(client):
    return client.get('/')
