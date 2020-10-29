import os
import tempfile
import pytest
import json

from halomod_app import create_app


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app({"TESTING": True})
    yield app


@pytest.fixture
def client(app):
    "A test client for the app."
    return app.test_client()


@pytest.fixture
def plot_payload():
    with open('halomod_app/thm_payload_plot.json') as json_file:
        return json.load(json_file)


@pytest.fixture
def create_payload():
    with open('halomod_app/thm_payload_create.json') as json_file:
        return json.load(json_file)
