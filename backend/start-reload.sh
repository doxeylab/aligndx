#!/usr/bin/env bash
set -e

# Let the DB start
sleep 10;

# Run migrations within the app directory and return to the current directory
(
cd ./app || exit 1;
alembic upgrade head
)

HOST=${HOST:-0.0.0.0}
PORT=${PORT:-8080}
LOG_LEVEL=${LOG_LEVEL:-info}

# Start Uvicorn with reload
exec uvicorn --reload --host $HOST --port $PORT --log-level $LOG_LEVEL app.main:app