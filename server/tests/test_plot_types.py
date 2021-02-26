def test_get_plot_types(client):
    response = client.get('/get_plot_types')
    assert response is not None
    assert response.status_code == 200
    assert "xLabels" in response.json
    assert "plotOptions" in response.json
