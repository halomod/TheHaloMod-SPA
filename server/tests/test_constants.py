def test_constants(client):
    response = client.get('/constants')
    assert response is not None
    assert response.status_code == 200
    assert "cosmo_defaults" in response.json
