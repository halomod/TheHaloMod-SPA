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
    decoded_image = base64.b64decode(json_response['figure'])
    with open("Output.png", "w") as png_file:
        png_file.write(json_response['figure'])
    print(imghdr.what(None, h=decoded_image))
    assert True is False


def home(client):
    return client.get('/')
