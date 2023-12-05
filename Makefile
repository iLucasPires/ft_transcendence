all: backend frontend

backend:
	@echo "Building backend..."
	@npm --prefix backend/ install
	@npm --prefix backend/ run start:dev

frontend:
	@echo "Building frontend..."
	@npm --prefix frontend/ install
	@npm --prefix frontend/ run dev

.PHONY: backend frontend
