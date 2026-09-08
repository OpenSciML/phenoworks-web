# Self-Hosted Deployment Options

PhenoWorks provides several self-hosted options, from a local workstation to
infrastructure in your own cloud account. You choose where the application,
research data, and supporting services run.

| Option | Best suited to | What is included |
| --- | --- | --- |
| [Development Docker Compose](docker-compose.md#development-stack) | Developing blocks, testing changes, and evaluating the platform locally | Source mounts, live reload, database, storage, worker, Agent, and MCP |
| [Production-style Docker Compose](docker-compose.md#production-style-stack) | A persistent installation on a workstation or server | Built application images with the same local service stack |
| [Google Cloud](gcp.md) | Hosting in your own GCP project with managed services | Terraform for Cloud Run, Cloud SQL, GCS, and Pub/Sub; MCP requires additional setup |

For development without running the full application in containers, follow the
[Getting Started guide](../getting-started.md). You will need to configure
and run the supporting services yourself.

## Choose a deployment

Start with development Compose if you want to explore PhenoWorks or work on its
code. Choose production-style Compose when you want built images without live
reload. Both configurations include `phenoworks-agent` and a separate
`phenoworks-mcp` service, although the agent still needs a configured model provider.

The GCP configuration moves metadata, files, and queues to managed services in
your account. It includes the agent package in the API image, but its Terraform
does not yet provision an MCP server or configure the agent's connection to one.
See the [GCP guide](gcp.md) for the infrastructure setup.

## Plan for your data and users

A deployment needs more than application containers. Keep the metadata database
and file storage persistent, back them up together, and retain the analysis
blocks used by your pipelines. For shared installations, configure credentials,
public URLs, HTTPS, and access to supporting services before inviting users.

Self-hosting the platform does not necessarily keep model requests local. The
agent sends requests to the model provider or gateway you configure. Choose that
service to match your research data requirements.

The guides below describe the configuration shipped in this repository. Examples
use the current `PHENOWORKS_*` environment variables and repository paths.
