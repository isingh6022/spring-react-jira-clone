# Jira clone

A small full-stack task-assignment system. Each task needs an area of expertise, and each contributor has one or more. An automatic routing engine assigns tasks to suitable contributors in the background. An operator watches the system, steps in when needed, and can see the history of what happened to each task.

## Setup

| Part | Stack | Notes |
| --- | --- | --- |
| `backend/` | Spring Boot 4, Java 17, Maven | Postgres via JPA; schema managed by Flyway (Hibernate only validates). DB settings from `DB_URL`, `DB_USER`, `DB_PASSWORD`. |
| `ui/` | React + TypeScript, Vite | Built into a static bundle and served by nginx. |
| `docker-compose.yml` | Postgres 16, backend, ui | Brings up the whole stack. |

Requests to `/api/*` are forwarded to the backend by nginx in Docker (and by the Vite proxy in local dev), so the browser talks to a single origin and no CORS setup is needed.

| Service | URL |
| --- | --- |
| UI | http://localhost:3000 |
| Backend | http://localhost:8080 |
| Postgres | localhost:5432 (db/user/password: `jiraclone`) |

Health check: `GET /api/health` returns `{"healthy": true, ...}`. The UI shows the result on its home page.

### Prerequisites

- Docker with Compose
- For local development outside Docker: JDK 17 and Node 24

## Commands

Run these from the repository root.

**Full stack (Docker)**

| Command | Description |
| --- | --- |
| `make up` | Build images and start all services in the background |
| `make down` | Stop and remove the containers (data is kept) |
| `make restart` | Stop, rebuild and start again |
| `make logs` | Follow logs from all services |
| `make ps` | Show container status |

**Database**

| Command | Description |
| --- | --- |
| `make db-up` | Start only Postgres |
| `make db-down` | Stop Postgres |
| `make db-reset` | Delete all data and start a fresh Postgres |
| `make db-shell` | Open `psql` in the database |

**Local development** (start the database first with `make db-up`)

| Command | Description |
| --- | --- |
| `make backend-run` | Run the backend on :8080 |
| `make backend-build` | Build the backend jar (skips tests) |
| `make backend-test` | Run the backend tests (needs Postgres running) |
| `make ui-install` | Install UI dependencies |
| `make ui-dev` | Start the Vite dev server (proxies `/api` to :8080) |
| `make ui-build` | Build the UI bundle into `ui/dist` |
| `make clean` | Remove backend and UI build output |
