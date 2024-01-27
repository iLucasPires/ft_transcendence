all: up

up: build
	docker-compose up -d

build:
	docker-compose build --no-cache

down:
	docker-compose down

fclean:
	docker-compose down --rmi  all --remove-orphans


.PHONY: all up build down fclean
