ifneq (,$(wildcard ./.env))
    include .env
    export
endif

SHELL := /bin/bash
ENV ?= dev

.PHONY: all
all: install-dependencies build-up setup-kraken

.PHONY: setup-env
setup-env:
	@bash ./scripts/setup-env.sh

.PHONY: install-dependencies
install-dependencies:
	@echo "Running install-dependencies.sh..."
	@./scripts/install-dependencies.sh

.PHONY: build-up
build-up: install-dependencies
	@echo "Starting up services..."
ifeq ($(ENV),prod)
	@docker-compose -f docker-compose.prod.yml up -d --build
else
	@docker-compose up -d --build
endif

.PHONY: setup-kraken
setup-kraken: build-up
	@echo "Setting up Kraken2 database..."
	@./scripts/setup-kraken.sh

.PHONY: start
start:
	@echo "Starting services..."
ifeq ($(ENV),prod)
	@docker-compose -f docker-compose.prod.yml up -d
else
	@docker-compose up -d 
endif

.PHONY: stop
stop:
	@echo "Stopping services..."
ifeq ($(ENV),prod)
	@docker-compose -f docker-compose.prod.yml down
else
	@docker-compose down
endif 

.PHONY: destroy
destroy:
	@echo "Pruning all unused Docker objects..."
	@docker system prune -a --volumes -f