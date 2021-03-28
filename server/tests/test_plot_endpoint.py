"""Tests for the /plot endpoint"""

from halomod import TracerHaloModel
import pickle

# GET
def test_get_plot_data(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.get('/plot', json={"x": "m", "y": "dndm"})
    assert "plot_data" in response.json
    assert "TheModel" in response.json["plot_data"]

