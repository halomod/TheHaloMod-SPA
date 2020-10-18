import os
import pytest


def test_home(client):
    response = home(client)
    assert response.json['start'] == 'This is the HaloModApp'


def test_plot(client):
    response = client.get('/plot')
    print(response)


def home(client):
    return client.get('/')
