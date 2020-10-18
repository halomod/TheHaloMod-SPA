import os
import pytest


def test_home(client):
    response = home(client)
    assert response.json['start'] == 'This is the HaloModApp'


def home(client):
    return client.get('/')
