#!/bin/bash 

# Build and run containers
docker-compose -f docker-compose.yml up -d --build

# Hack to wait for postgres container to be up before running alembic migrations
sleep 5;

# Run migrations
docker-compose -f docker-compose.yml run --rm -w "/app/app" backend alembic upgrade head
 