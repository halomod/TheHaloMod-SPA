"""Houses the fixtures for the tests.

Pytest documentation on fixtures: https://docs.pytest.org/en/stable/fixture.html"""

import pytest
import json
from halomod_app import create_app


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app({"TESTING": True})
    app.config['SECRET_KEY'] = 'sekrit!'
    yield app


@pytest.fixture
def client(app):
    "A test client for the app."
    return app.test_client()


@pytest.fixture
def plot_payload():
    with open('tests/thm_payload_plot.json') as json_file:
        return json.load(json_file)


@pytest.fixture
def create_payload():
    """An example payload for the `/create` route that can be used in tests."""
    with open('tests/thm_payload_create.json') as json_file:
        return json.load(json_file)
