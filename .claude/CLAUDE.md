# Jira clone

Small Jira clone where tasks are assigned to contributors by an async, simulated routing engine (slow or never-returning responses), with an operator who can intervene.

## Setup

- `backend/`: Spring Boot 4 (Java 17, Maven), Postgres via JPA, schema via Flyway (`ddl-auto=validate`). DB config from `DB_URL`/`DB_USER`/`DB_PASSWORD`.
- `ui/`: React + TypeScript (Vite). Served by nginx in Docker; nginx (and Vite dev proxy) forward `/api` to the backend.
- `docker-compose.yml`: `db` (Postgres 16, :5432), `backend` (:8080), `ui` (:3000).
- `Makefile` in root wraps common commands (`make up`, `make down`, `make backend-run`, `make ui-dev`, ...).
