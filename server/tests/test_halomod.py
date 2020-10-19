import os
import pytest
import json
import imghdr
import base64


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


def home(client):
    return client.get('/')
