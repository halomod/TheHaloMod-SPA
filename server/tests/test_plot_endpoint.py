"""Tests for the /plot endpoint"""

from halomod import TracerHaloModel
import pickle
import json

# POST


def test_get_plot_data(client):
    with client.session_transaction() as sess:
        sess["models"] = pickle.dumps({"TheModel": TracerHaloModel()})
    response = client.get('/plot', query_string=dict(x="m", y="dndm"))
    assert "plot_data" in json.loads(response.get_data(as_text=True))
    assert "TheModel" in json.loads(response.get_data(as_text=True))["plot_data"]
