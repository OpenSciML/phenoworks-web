# Getting Started

This section gets a new local PhenoWorks web-platform checkout to the first usable study workspace.

## Quick Path

1. Install the backend package and frontend dependencies.
2. Configure database, data directory, and branding values.
3. Start the FastAPI backend and Next.js frontend.
4. Sign in with the default local administrator account.
5. Create a project, study, dataset, plot, and asset.
6. Run the first analysis pipeline.

## Requirements

| Area | Requirement |
| --- | --- |
| Python | Python 3.11 or newer. |
| Backend | FastAPI, SQLAlchemy, Pydantic, LgoPy, lgopy-catalog, Celery/RabbitMQ support, and storage dependencies from `pyproject.toml`. The backend runs locally today and is intended to move to cloud infrastructure later. |
| Frontend | Node.js and the package manager used by the `ui/` workspace. |
| Database | PostgreSQL through `PHENOWORKS_DB_*` settings, or an explicit PostgreSQL `PHENOWORKS_DATABASE_URL`. |
| Storage | A writable `PHENOWORKS_DATA_DIR` for uploads, assets, artifacts, analysis modules, and logs. |

## Launch Commands

### Both Servers

```bash
make run-dev
# or: just run-dev
```

### Backend

```bash
make dev-api
# or: just dev-api
```

### Frontend

```bash
make dev-ui
# or: just dev-ui
```

## Default Login

| User | Email | Password |
| --- | --- | --- |
| Administrator | `admin@phenoworks.local` | `phenoworks-admin` |
| Collaborator demo user | `collaborator@phenoworks.local` | `phenoworks-collab` |

:::warning

Replace default credentials and secrets before exposing the app outside a local development environment. Keep `AUTH_SECRET` or `NEXTAUTH_SECRET` stable inside one environment so browser sessions remain valid.

:::

## Next Steps

- Install on Windows: [Install PhenoWorks on Windows](/blog/install-phenoworks-on-windows)
- Configure runtime settings: [Configuration](tutorials/configure-settings.md)
- Create a study workspace: [First Project](tutorials/first-project.md)
