#!/bin/bash 

# Build and run containers
docker-compose -f docker-compose.m1.yml up -d --build

# Hack to wait for postgres container to be up before running alembic migrations
sleep 5;

# Run migrations
docker-compose -f docker-compose.m1.yml run --rm -w "/app/app" backend alembic upgrade head

#Just to be safe
sleep 5;

# Download default index 
docker-compose -f docker-compose.m1.yml run --rm -w "/app" backend gdown "https://drive.google.com/drive/folders/1G4fJGf_CutQIycQvGTTbSG4IP3LnelKs" -O ./indexes/sars_with_human_decoys/ --folder

# clear screen and list docker container links
address='http://localhost:' 
backend_docs='8080/docs'
backend_redoc='8080/redoc'
postgres_admin_port='8001'
clear
echo "Access the various containers through the following links:"
echo "Frontend: $address"
echo "Backend API using Swagger: $address$backend_docs"
echo "Backend API using ReDoc: $address$backend_redoc"
echo "Postgres Admin: $address$postgres_admin_port" 
