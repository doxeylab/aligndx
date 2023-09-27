-include .env
export $(shell sed 's/=.*//' .env)


SHELL := /bin/bash

.PHONY: all
all: install_dependencies build_up migrate setup_minio sync_repo

.PHONY: install_dependencies
install_dependencies:
	@echo "Checking and installing dependencies if needed..."
	@which aws || (echo "Installing AWS CLI..." && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install && rm -rf awscliv2.zip ./aws)
	@which git || (echo "Installing Git..." && sudo apt-get update && sudo apt-get install -y git)
	@which docker || (echo "Installing Docker..." && curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && rm get-docker.sh)
	@which docker-compose || (echo "Installing Docker Compose..." && sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose)

.PHONY: build_up
build_up: install_dependencies
	@echo "Starting up services..."
	@docker-compose up -d --build

.PHONY: migrate
migrate: build_up
	@echo "Running migrations..."
	# Ensure that services are up before running migrations
	@docker-compose up -d --build || (echo "Docker Compose Up failed!" && exit 1)
	# Wait for PostgreSQL to be up before running migrations
	@while ! docker-compose exec -T postgres pg_isready; do sleep 5; done
	@docker-compose exec backend alembic upgrade head || (echo "Migration failed!" && exit 1)


.PHONY: setup_minio
setup_minio: build_up
	@echo "Setting up Minio buckets..."
	@# Wait for Minio to be ready
	@while ! docker-compose exec -T minio curl -s http://localhost:9000/minio/health/live; do echo 'Waiting for Minio...'; sleep 5; done
	@# Configuring mc with the Minio service
	@docker-compose exec -T minio sh -c "mc alias set local http://localhost:9000 $$MINIO_ROOT_USER $$MINIO_ROOT_PASSWORD"
	@# Creating the buckets
	@docker-compose exec -T minio sh -c "mc mb local/uploads || true"
	@docker-compose exec -T minio sh -c "mc mb local/submissions || true"
	@docker-compose exec -T minio sh -c "mc mb local/results || true"
	@docker-compose exec -T minio sh -c "mc mb local/workflows || true"


.PHONY: sync_repo
sync_repo: setup_minio
	@echo "Downloading and syncing the git repo..."
	@git clone $(WORKFLOW_REPO_URL) || (echo "Git clone failed!" && exit 1)
	@AWS_ACCESS_KEY_ID=$(STORAGE_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(STORAGE_SECRET_ACCESS_KEY) AWS_DEFAULT_REGION=$(STORAGE_REGION_NAME) aws s3 sync $(WORKFLOWS_LOCATION) s3://workflows --endpoint-url http://localhost:9000 || (echo "AWS S3 Sync failed!" && exit 1)
	@rm -rf $(WORKFLOWS_LOCATION)


.PHONY: start_services
start_services:
	@echo "Starting services..."
	@docker-compose start

.PHONY: stop_services
stop_services:
	@echo "Stopping services..."
	@docker-compose down

.PHONY: prune_all
prune_all:
	@echo "Pruning all unused Docker objects..."
	@docker system prune -a --volumes -f
