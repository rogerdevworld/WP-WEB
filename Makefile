# Project Name
NAME = foodlive

# Paths
SRCS_DIR = ./srcs
COMPOSE_FILE = $(SRCS_DIR)/docker-compose.yml
ENV_FILE = $(SRCS_DIR)/.env

# Colors
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m

all: up

up:
	@echo "$(GREEN)Starting FoodLive ecosystem...$(NC)"
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up --build -d

down:
	@echo "$(YELLOW)Shutting down FoodLive...$(NC)"
	docker compose -f $(COMPOSE_FILE) down

stop:
	@echo "$(YELLOW)Stopping containers...$(NC)"
	docker compose -f $(COMPOSE_FILE) stop

start:
	@echo "$(GREEN)Starting containers...$(NC)"
	docker compose -f $(COMPOSE_FILE) start

clean: down
	@echo "$(RED)Cleaning containers and networks...$(NC)"
	docker system prune -a -f

fclean: clean
	@echo "$(RED)Deep cleaning: removing volumes, images and local dependencies...$(NC)"
	docker volume rm $$(docker volume ls -q) || true
	@echo "$(YELLOW)Removing node_modules and build artifacts...$(NC)"
	rm -rf node_modules dist .vite
	rm -rf django_backend/venv django_backend/__pycache__
	@echo "$(GREEN)System is pristine.$(NC)"

re: fclean all

seed:
	@echo "$(GREEN)Injecting bio-data seeds...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec backend python manage.py migrate
	docker compose -f $(COMPOSE_FILE) exec backend python seed_complete.py

logs:
	docker compose -f $(COMPOSE_FILE) logs -f

status:
	docker compose -f $(COMPOSE_FILE) ps

.PHONY: all up down stop start clean fclean re seed logs status
