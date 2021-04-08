"""Houses the tests for the server."""

from halomod import TracerHaloModel


def test_home(client):
    response = client.get('/')
    assert response.json['start'] == 'This is the HaloModApp'
