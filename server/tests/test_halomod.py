import os
import pytest
import json
import imghdr
import codecs
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
    print('The type is: ', type(json_response['figure']))
    byte_array = base64.b64decode(
        json_response['figure'][2:len(json_response['figure']) - 1])
    decoded_image = codecs.decode(byte_array, "base64")

    # For now this outputs an image to test what is being returned
    with open("Output.png", "w+b") as png_file:
        png_file.write(decoded_image)
    print(imghdr.what(None, h=decoded_image))
    assert True is False


def home(client):
    return client.get('/')
