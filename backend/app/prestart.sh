#! /usr/bin/env bash

# Let the DB start
sleep 10;

# Run migrations within the app directory and return to the current directory
(
cd ./app || exit 1;
alembic upgrade head
)