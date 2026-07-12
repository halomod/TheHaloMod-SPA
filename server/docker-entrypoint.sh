#!/bin/sh
set -e

# Generate a fresh self-signed certificate on every container start, using
# the exact same cert-generation code (generate_adhoc_ssl_pair, via
# make_ssl_devcert) that `flask run --cert=adhoc` used before this switched
# to gunicorn. This keeps external-facing TLS behavior unchanged instead of
# guessing at a new certificate scheme.
python3 -c "from werkzeug.serving import make_ssl_devcert; make_ssl_devcert('/tmp/thehalomod-adhoc-cert', cn='thehalomod')"

# --workers 1: a threading.Semaphore in utils.py (modelCreationSem) is what
# prevents concurrent halomod/CAMB model creation from crashing the server.
# That only works within a single process, so more than one worker would
# silently defeat it.
#
# --timeout / --graceful-timeout: model creation can legitimately take up to
# MODEL_COMPUTE_TIMEOUT_MS (60s, see client/src/utils/Store.js) for a slow
# CAMB computation. Gunicorn's sync worker defaults to a 30s timeout, which
# would kill a worker mid-computation; both are raised well above that.
exec gunicorn \
  --workers 1 \
  --timeout 120 \
  --graceful-timeout 90 \
  --access-logfile - \
  --error-logfile - \
  --capture-output \
  --bind "${FLASK_RUN_HOST:-0.0.0.0}:${FLASK_RUN_PORT:-5000}" \
  --certfile /tmp/thehalomod-adhoc-cert.crt \
  --keyfile /tmp/thehalomod-adhoc-cert.key \
  "halomod_app:create_app()"
