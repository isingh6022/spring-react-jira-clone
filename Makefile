.PHONY: up down restart logs ps db-up db-down db-reset db-shell backend-run backend-build backend-test ui-install ui-dev ui-build clean

# ---------- Full stack (docker compose) ----------

up:
	docker compose up --build -d

down:
	docker compose down

restart:
	docker compose down
	docker compose up --build -d

logs:
	docker compose logs -f

ps:
	docker compose ps

# ---------- Database only ----------

db-up:
	docker compose up -d db

db-down:
	docker compose stop db

# Deletes all data (removes the postgres volume).
db-reset:
	docker compose down -v
	docker compose up -d db

db-shell:
	docker compose exec db psql -U jiraclone -d jiraclone

# ---------- Backend (local, needs db-up) ----------

backend-run:
	cd backend && ./mvnw spring-boot:run

backend-build:
	cd backend && ./mvnw -DskipTests package

backend-test:
	cd backend && ./mvnw test

# ---------- UI (local) ----------

ui-install:
	cd ui && npm install

ui-dev:
	cd ui && npm run dev

ui-build:
	cd ui && npm run build

# ---------- Cleanup ----------

clean:
	cd backend && ./mvnw clean
	rm -rf ui/dist
