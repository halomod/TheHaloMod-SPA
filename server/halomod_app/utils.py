"""Plotting and driving utilities for TheHaloMod-SPA."""

import logging
from flask import session
from flask_session.redis.redis import RedisSessionInterface
from itsdangerous import BadSignature
from typing import Union
from halomod import TracerHaloModel
from halomod.wdm import HaloModelWDM
import re
import codecs
import pickle
import json
import sentry_sdk
from os import path, mkdir
import threading

logger = logging.getLogger(__name__)

# Generate a semaphore to only allow model creation one at a time across
# requests
modelCreationSem = threading.Semaphore()


def get_models() -> dict:
    """Loads the current session's model dict, or an empty dict if the
    session doesn't have one yet. Centralizes a load pattern that used to be
    duplicated in every endpoint that touches session-stored models.

    If the stored data can no longer be unpickled - e.g. a library upgrade
    (astropy, hmf, halomod, ...) moved or renamed a class that an
    already-pickled session's models still reference - the session is reset
    to an empty model dict instead of crashing every subsequent request for
    that session. The stale data is unrecoverable either way once this
    happens, so surfacing it to Sentry and moving on is preferable to
    permanently 500ing until the user manually clears their cookies.
    """
    if 'models' not in session:
        return {}
    try:
        return pickle.loads(session.get('models'))
    except Exception as e:
        sentry_sdk.capture_exception(e)
        session['models'] = pickle.dumps({})
        return {}


def get_model_names():
    """Helper function that abstracts logic for getting names of all models
    associated with the function"""
    return list(get_models().keys())


class LockingRedisSessionInterface(RedisSessionInterface):
    """A RedisSessionInterface that holds a per-session Redis lock for the
    whole request lifecycle - from the session being loaded to it being
    saved back - rather than just whatever a view function does in between.

    This matters because Flask-Session loads the session once at request
    start (`open_session`) and unconditionally overwrites it in Redis at
    request end (`save_session`), and *both* of those happen outside any
    view function's own code (the latter runs after the view function has
    already returned, while Flask builds the response). A lock acquired and
    released only inside a view function - e.g. wrapping
    `session["models"] = ...` - doesn't cover that: a second concurrent
    request for the same session (two open tabs, a double-click, or a
    client retry firing while a slow request is still in flight - see
    axios-retry in the client) can load its own copy of the session before
    the first request's `save_session` has run, and then unconditionally
    overwrite it with that stale copy once *its own* request finishes,
    silently losing whatever the first request had saved.

    Locking around the whole load-to-save window closes that window. This
    is a *different* lock from `modelCreationSem` below: that one is a
    process-global semaphore protecting concurrent halomod/CAMB calls
    (unsafe to run in parallel at all, regardless of session); this one
    only needs to keep one session's own data from racing with itself, so
    it's scoped per-session rather than global.

    The lock has a timeout so a crashed request can't leave it stuck
    forever (matching the fix for the same class of bug in
    `modelCreationSem`'s usage elsewhere in this app).
    """

    LOCK_TIMEOUT_SECONDS = 120

    def open_session(self, app, request):
        # The lock must be acquired *before* the session data is read, not
        # after: `super().open_session()` is what actually reads the current
        # value from Redis, so acquiring the lock on its result (as a first
        # attempt at this did) still lets two concurrent requests both read
        # the same stale data before either one ever waits on the lock - the
        # lock would then only serialize the writes, not the read-modify-write
        # as a whole. So the sid has to be recovered from the cookie here,
        # independently, so the lock can be taken first.
        sid = request.cookies.get(app.config["SESSION_COOKIE_NAME"])
        if sid and self.use_signer:
            try:
                sid = self._unsign(app, sid)
            except BadSignature:
                sid = None

        lock = None
        if sid:
            lock = self.client.lock(
                f"halomod-session-lock:{sid}", timeout=self.LOCK_TIMEOUT_SECONDS)
            lock.acquire()

        sess = super().open_session(app, request)
        sess.lock = lock
        return sess

    def save_session(self, app, session, response):
        try:
            super().save_session(app, session, response)
        finally:
            lock = getattr(session, 'lock', None)
            if lock is not None:
                lock.release()


def hmf_driver(cls=TracerHaloModel,
               previous: Union[None, TracerHaloModel] = None, **kwargs):
    if previous is None:
        return cls(**kwargs)
    elif "wdm_model" in kwargs and not isinstance(previous, HaloModelWDM):
        return HaloModelWDM(**kwargs)
    elif "wdm_model" not in kwargs and isinstance(previous, HaloModelWDM):
        return TracerHaloModel(**kwargs)
    else:
        this = previous.clone(**kwargs)

        # TODO: this is a hack, and should be fixed in hmf
        # we have to set all _params whose model has been changed to {}
        # so that they don't get carry-over parameters from other models.
        for k, v in kwargs.items():
            if not k.endswith("model"):
                continue
            current_model = getattr(this, k)
            if current_model is None:
                current_name = None
            elif isinstance(current_model, type):
                # Component models (e.g. transfer_model, hmf_model) are
                # stored as the class itself.
                current_name = current_model.__name__
            else:
                # cosmo_model is stored as an instantiated Cosmology object.
                current_name = current_model.__class__.__name__
            if v != current_name:
                this.update(**{k.replace("model", "params"): {}})

        return this


def camel_to_words(word: str) -> str:
    n = len(word)
    word = re.sub(r"(?<!^)(?=[A-Z])", " ", word)
    if len(word.split(" ")) == n:
        return word.replace(" ", "")
    return word


def serialize_model(model) -> str:
    return codecs.encode(pickle.dumps(model), "base64").decode()


def deserialize_model(serialized_model):
    return pickle.loads(codecs.decode(serialized_model.encode(), "base64"))


def load_json(file_location):
    with open(file_location) as json_file:
        return json.load(json_file)


def get_initial_model() -> TracerHaloModel:
    """Gets the initial high-resolution model for the application to make
    copies off of for new models.

    This makes subsequent model creation much faster.
    """
    # Intiialize the initial model variable
    initial_model = None

    # Check if the high-definition model has already been created previously
    file_directory = './generated/'
    file_name = 'high_def_model.pkl'
    high_def_file_path = file_directory + file_name
    if path.exists(high_def_file_path):
        print('High definition model already exists, loading from file.')
        with open(high_def_file_path, 'rb') as high_def_file:
            initial_model = pickle.load(high_def_file)
    else:
        print('Beginning initial model creation. This might take a bit...')
        initial_model = TracerHaloModel(rmax=150, rnum=200, transfer_params={
                                        "kmax": 1e3, 'extrapolate_with_eh': True})
        print('Done creating the high resolution initial model. Now saving' +
              ' the model to ' + high_def_file_path + ' for later use.')

        mkdir(file_directory)
        with open(high_def_file_path, 'xb') as high_def_file:
            pickle.dump(initial_model, high_def_file, pickle.HIGHEST_PROTOCOL)
        print('Done saving the high resolution model to file.')

    return initial_model
