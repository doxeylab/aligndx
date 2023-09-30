#!/usr/bin/env bash
set -e

# Run prestart script if it exists
PRE_START_PATH=${PRE_START_PATH:-./prestart.sh}
echo "Checking for script in $PRE_START_PATH"
if [ -f "$PRE_START_PATH" ] ; then
    echo "Running script $PRE_START_PATH"
    . "$PRE_START_PATH"
else 
    echo "There is no script $PRE_START_PATH"
fi
# Start Gunicorn
exec gunicorn -k uvicorn.workers.UvicornWorker -c ./app/gunicorn_conf.py app.main:app
