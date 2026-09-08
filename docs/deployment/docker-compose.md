# Docker Compose Deployment

Docker Compose runs PhenoWorks and its supporting services on your own machine.
Choose the development stack for live code changes or the production-style stack
for built application images. Both are [self-hosted options](index.md) and keep
their database and file storage on the Docker host.

## Before you start

You need Docker with the Compose plug-in, a running Docker engine, and a checkout
with its submodules initialized. Run commands from the repository root:

```bash
git submodule update --init --recursive
```

Use GNU Make on Linux/macOS or WSL, or the repository's `justfile` on Windows,
Linux, and macOS. Recipe names match: `make compose-dev-up` and
`just compose-dev-up` start the same stack.

The supplied Compose files use the same project name and volumes. Run one stack
at a time.

## Configure the environment

If you do not already have a root `.env`, copy the local example:

```bash
cp .env.sample.local .env
```

The task runners pass this file to Compose for variable substitution. Review it
before starting; some settings in the Compose files are fixed rather than taken
from `.env`.

For the bundled MCP service, set:

```dotenv
PHENOWORKS_AGENT_MCP_URL=http://mcp:8787/mcp
PHENOWORKS_AGENT_MODEL_NAME=gemini/gemini-2.5-flash
GOOGLE_API_KEY=<your-model-provider-key>
```

The local sample's `127.0.0.1` MCP address is for processes running on the host.
Inside the API container, use `http://mcp:8787/mcp`, or leave the variable blank
to select the Compose default. Other model providers or gateways can use
`PHENOWORKS_AGENT_LLM_API_BASE` and `PHENOWORKS_AGENT_LLM_API_KEY`.

Set `PHENOWORKS_ADMIN_EMAIL`, `PHENOWORKS_ADMIN_PASSWORD`, and
`PHENOWORKS_SECRET_KEY` for your installation. Bootstrap password reset is
controlled separately by `PHENOWORKS_BOOTSTRAP_ADMIN_RESET_PASSWORD`; changing
the initial password setting is not a general password-reset procedure.

## Development stack

```bash
make compose-dev-up
```

This uses `deployment/compose/docker-compose.dev.yml`, mounts the source tree,
and starts the API and UI with development reload. Python and Node caches live
in Docker volumes.

```bash
make compose-dev-logs
make compose-dev-build
make compose-dev-down
```

## Production-style stack

```bash
make compose-up
```

This uses `deployment/compose/docker-compose.yml`. It builds the API, MCP, and UI
images, runs the API without reload, and serves the compiled Next.js application.
It is a starting point for hosting on your own server; the supplied URLs and
credentials are configured for local use.

```bash
make compose-logs
make compose-build
make compose-down
```

Both `up` recipes build and start services in the foreground. Run status and
administration commands in another terminal.

## Services and local addresses

| Service | Purpose | Address |
| --- | --- | --- |
| `ui` | Web application | `http://localhost:3000` |
| `api` | Backend and Agent | `http://localhost:9000/api/docs` for API documentation |
| `mcp` | Authenticated PhenoWorks tools | `http://localhost:8787/mcp` |
| `worker` | Celery pipeline processing | Internal service |
| `db` | PostgreSQL 16, PostGIS, and pgvector | `localhost:5433` |
| `rabbitmq` | Job broker | `localhost:5672`; management at `http://localhost:15672` |
| `tusd` | Resumable uploads | `http://localhost:1080/files/` |
| `titiler` | Raster tiles | `http://localhost:8000` |
| `pgadmin` | Database administration | `http://localhost:5050` |

The unmodified local defaults are `admin@phenoworks.local` / `phenoworks-admin`
for PhenoWorks, `postgres` / `postgres` for PostgreSQL,
`phenoworks` / `phenoworks` for RabbitMQ, and
`admin@phenoworks.dev` / `phenoworks-admin` for pgAdmin.

## Agent and MCP

The agent runs inside the API. It connects to `http://mcp:8787/mcp`, and MCP
forwards each user's credential to `http://api:9000/api`. Agent and MCP packages
use separate Python environments to accommodate their dependencies.

MCP downloads persist in the `phenoworks-agent-workspaces` volume. Restart the
development `mcp` service after changing its source. For production-style
installations, rebuild affected images after package changes. Start a new agent
conversation to refresh discovered tools.

## Persistent data

The task runners mount the repository's `data/` directory at
`/var/lib/phenoworks` in the API, worker, and upload service. To use another host
directory:

```bash
PHENOWORKS_DATA_DIR=/absolute/path/to/phenoworks-data make compose-up
```

With `just`:

```bash
just PHENOWORKS_DATA_DIR=/absolute/path/to/phenoworks-data compose-up
```

The runner passes this path as `PHENOWORKS_DATA_DIR_HOST`. File records keep
logical keys under the storage root; processing code resolves them to local
paths when needed. Database state and other service data use named Docker
volumes, so back up both the mounted files and the database.

Normal `compose-down` recipes preserve named volumes. The `compose-fresh-up` and
`compose-dev-fresh-up` recipes run `down --volumes`: they reset Docker-managed
data, including PostgreSQL. Reserve them for disposable environments.

## Install analysis blocks

Use the API container so the command shares the application's database, catalog,
and storage configuration. For the development stack:

```bash
docker compose --env-file .env -f deployment/compose/docker-compose.dev.yml exec api \
  uv run phenoworks analysis-blocks install-sources blocks/image_analysis \
  --build-dir /var/lib/phenoworks/analysis-block-builds

docker compose --env-file .env -f deployment/compose/docker-compose.dev.yml exec api \
  uv run phenoworks analysis-blocks list
```

Other source groups include `blocks/vegetation_indices` and `blocks/phenobox`.
Choose blocks appropriate for your inputs and installed dependencies. For the
production-style stack, use `deployment/compose/docker-compose.yml` instead.
If you changed the host data directory, also pass the same
`PHENOWORKS_DATA_DIR_HOST` value to direct Compose commands.

## Hosting beyond localhost

Before using the stack on a shared server, adapt the Compose configuration for
your hostname and HTTPS endpoint. The shipped files contain local values for
uploads, CORS, authentication secrets, service credentials, and the agent's
WebSocket URL; a root `.env` does not override every one of these fields.

In particular, update `NEXTAUTH_URL`, the browser-facing upload endpoint, and
`NEXT_PUBLIC_PHENOWORKS_AGENT_WS_BASE_URL` to the addresses your users can reach.
Use `wss://` for the agent when the site uses HTTPS. Update the production UI
build arguments as well as its runtime environment, then rebuild the UI.
Keep container-to-container addresses such as `http://api:9000/api` internal.

Put shared access behind your HTTPS configuration and restrict database, broker,
and administration ports to the intended network. Replace the local service and
UI authentication secrets in the Compose configuration before exposing it.

## Verify the installation

Open the UI, sign in, and create a small dataset. Upload an image and inspect it
before trying a compatible analysis block. Confirm that the worker completes the
job and its outputs appear in the workspace.

For service status and logs:

```bash
docker compose --env-file .env -f deployment/compose/docker-compose.yml ps
docker compose --env-file .env -f deployment/compose/docker-compose.yml logs api mcp worker
```

Use the development filename for that stack. If a service fails, inspect its logs
before resetting volumes or rebuilding dependencies.
