#!/usr/bin/env bash
set -e

# Let the DB start
sleep 10;

# Run migrations within the app directory and return to the current directory
(
cd ./app || exit 1;
alembic upgrade head
)

# Start Gunicorn
exec gunicorn -k uvicorn.workers.UvicornWorker -c ./app/gunicorn_conf.py app.main:app
