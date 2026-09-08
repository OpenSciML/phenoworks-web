# Docker Compose Deployment

Use Docker Compose when you want the full PhenoLab web platform on one machine with local service dependencies. The Compose deployment runs the same application services used by the hosted architecture, but keeps metadata, queues, uploads, and files on the local Docker host.

## Current Versions

| Component | Version or image |
| --- | --- |
| PhenoLab backend package | `1.0.0` |
| PhenoLab UI package | `1.0.0` |
| Python image | `ghcr.io/astral-sh/uv:python3.11-bookworm` |
| PostgreSQL/PostGIS base | `postgis/postgis:16-3.4` |
| pgvector package | `postgresql-16-pgvector` |
| RabbitMQ | `rabbitmq:3.13-management` |
| tusd | `tusproject/tusd:v2.9.2` |
| TiTiler | `ghcr.io/developmentseed/titiler:latest` |

## Stack Layout

Compose starts:

| Service | Purpose | Local endpoint |
| --- | --- | --- |
| `api` | FastAPI backend | `http://localhost:9000` |
| `mcp` | PhenoLab tools with per-request authentication | `http://localhost:8787/mcp` |
| `ui` | Next.js app | `http://localhost:3000` |
| `worker` | Celery operation worker | internal service |
| `db` | PostgreSQL 16 with PostGIS and pgvector | `localhost:5433` |
| `rabbitmq` | Celery broker | `localhost:5672`, management at `http://localhost:15672` |
| `tusd` | Resumable upload server | `http://localhost:1080/files/` |
| `titiler` | Dynamic COG tile server | `http://localhost:8000` |
| `pgadmin` | Database admin UI | `http://localhost:5050` |

API documentation is available at `http://localhost:9000/api/docs`.

Both stacks install `phenolab-agent` in the API and run `phenolab-mcp` in a separate
environment. The agent connects to `http://mcp:8787/mcp`; MCP forwards the user's
credential to `http://api:9000/api`. Leave `PHENOLAB_AGENT_MCP_URL` unset or blank
to use this default, or supply a URL reachable from the API container. The
`127.0.0.1` URL in `.env.sample.local` is for running outside Docker and must be
replaced when using Compose. Model and gateway settings are identical in both
stacks: `PHENOLAB_AGENT_MODEL_NAME`, `PHENOLAB_AGENT_LLM_API_BASE`, and
`PHENOLAB_AGENT_LLM_API_KEY`; Gemini can also use `GOOGLE_API_KEY`.

MCP downloads persist in the `phenolab-agent-workspaces` volume. Restart the
development MCP service after source changes; rebuild production images after
package changes. Start a new chat to refresh tool discovery. These stacks share
a Compose project name and volumes, so run one at a time.

## Command runner

Run the examples below with GNU Make on Linux/macOS or WSL. The repository's
cross-platform `justfile` exposes the same recipe names, so you can replace
`make` with `just` on Windows, Linux, or macOS. For example, `make
compose-dev-up` and `just compose-dev-up` are equivalent. See the installation
guide for non-admin Windows installation instructions for `just`.

## Development Stack

From the repository root:

```bash
make compose-dev-up
```

The development stack uses `deployment/compose/docker-compose.dev.yml`. It bind-mounts the source tree, runs the backend with Uvicorn reload, runs the frontend with `next dev`, and keeps Python and Node dependency caches in Docker volumes.

Useful commands:

```bash
make compose-dev-logs
make compose-dev-build
make compose-dev-down
make compose-dev-fresh-up
```

Use `compose-dev-fresh-up` when you intentionally want to recreate Docker-managed Postgres, RabbitMQ, pgAdmin, and cache volumes.

## Production-Style Local Stack

From the repository root:

```bash
make compose-up
```

The production-style stack uses `deployment/compose/docker-compose.yml`. It builds application images, runs Uvicorn without reload, runs a built Next.js app with `next start`, and starts the external Celery worker.

Useful commands:

```bash
make compose-logs
make compose-build
make compose-down
make compose-fresh-up
```

## Data and Storage

Compose stores PhenoLab runtime data under the repository `data/` directory by default. Override the host path when you need data outside the checkout:

```bash
PHENOLAB_DATA_DIR=/absolute/path/to/phenolab-data make compose-dev-up
```

The equivalent `just` command is:

```bash
just PHENOLAB_DATA_DIR=/absolute/path/to/phenolab-data compose-dev-up
```

The selected task runner passes this as `PHENOLAB_DATA_DIR_HOST` and mounts it
at `/var/lib/phenolab` in the API, worker, and tusd containers. Database
`file_uri` values remain logical keys under that root; local filesystem paths
are only materialized at processing boundaries.

## Local Credentials

Default local credentials:

| Service | Login |
| --- | --- |
| PhenoLab | `admin@phenolab.local` / `phenolab-admin` |
| PostgreSQL | `postgres` / `postgres` |
| pgAdmin | `admin@phenolab.dev` / `phenolab-admin` |
| RabbitMQ | `phenolab` / `phenolab` |

## Analysis Blocks

Install the bundled common LgoPy blocks inside the container so the command uses the same database, catalog path, and mounted data directory as the backend:

```bash
docker compose -f deployment/compose/docker-compose.dev.yml exec api \
  uv run phenolab analysis-blocks install-sources blocks/common \
  --build-dir /var/lib/phenolab/analysis-block-builds
```

Verify the installed blocks:

```bash
docker compose -f deployment/compose/docker-compose.dev.yml exec api \
  uv run phenolab analysis-blocks list
```

For the production-style stack, use `deployment/compose/docker-compose.yml` in the same commands.

## Troubleshooting

If Docker is not running, Compose commands fail with a Docker socket error. Start Docker Desktop and retry.

If pgAdmin does not appear, inspect the published port and service logs:

```bash
docker compose -f deployment/compose/docker-compose.dev.yml ps
docker compose -f deployment/compose/docker-compose.dev.yml logs db pgadmin rabbitmq worker
```

If RabbitMQ's management UI does not appear, check whether port `15672` is already in use and whether the broker is healthy:

```bash
docker compose -f deployment/compose/docker-compose.dev.yml ps rabbitmq
docker compose -f deployment/compose/docker-compose.dev.yml logs rabbitmq
```

If dependency caches are stale in the UI service, recreate the relevant Docker volumes:

```bash
docker compose -f deployment/compose/docker-compose.dev.yml stop ui
docker compose -f deployment/compose/docker-compose.dev.yml rm -f ui
docker volume rm phenolab_phenolab-ui-next
docker volume rm phenolab_phenolab-ui-node-modules
docker compose -f deployment/compose/docker-compose.dev.yml up --build ui
```

If a build fails with `no space left on device`, check `.dockerignore`, then prune failed build cache deliberately:

```bash
docker builder prune
```
