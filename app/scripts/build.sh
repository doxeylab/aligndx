#!/bin/bash 

# Build and run containers
docker-compose -f docker-compose.yml up -d --build

# Hack to wait for postgres container to be up before running alembic migrations
sleep 5;

# Run migrations
docker-compose -f docker-compose.yml run --rm -w "/app/app" backend alembic upgrade head

#Just to be safe
sleep 5;

# Download default index 
docker-compose -f docker-compose.yml run --rm -w "/app" backend gdown "https://drive.google.com/drive/folders/1kDQKzUHo3_0EYbPb3RPW209l7ZKCkxIV?usp=sharing" -O ./indexes/kraken_db/ --folder
 