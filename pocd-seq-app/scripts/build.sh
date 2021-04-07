#!/bin/bash

# Build and run containers
docker-compose up -d --build

# Hack to wait for postgres container to be up before running alembic migrations
sleep 5;

# Run migrations
docker-compose run --rm -w "/app/app" backend alembic upgrade head