MAKEFLAGS += --no-print-directory
.DEFAULT_GOAL = help

help:
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help install migrate seed test serve cache-clear queue-clear artisan composer npm

install: ## Install dependencies
	composer install
	npm install

up: ## Start the application
	docker compose up -d

build: ## Build the application
	docker compose build

down: ## Stop the application
	docker compose down

end: ## Stop and remove containers, networks, images, and volumes
	docker compose down --volumes --remove-orphans

migrate: ## Run database migrations
	php artisan migrate

reset: ## Reset the database
	php artisan migrate:fresh

refresh: ## Refresh the database
	php artisan migrate:refresh

seed: ## Seed the database
	php artisan db:seed

serve: ## Start the development server
	php artisan serve

clear: ## Clear application cache
	php artisan cache:clear
	php artisan config:clear
	php artisan route:clear
	php artisan view:clear
