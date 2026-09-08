# PhenoWorks MCP

PhenoWorks MCP (`phenoworks-mcp`) connects compatible AI assistants to the
PhenoWorks API through the Model Context Protocol. It gives them tools to find
data, inspect methods, run pipelines, and retrieve results using the caller's
access permissions.

The [PhenoWorks Agent](phenoworks-agent.md) provides the conversational experience.
MCP provides the tools that connect an assistant to the research workspace.

## Available tools

| Task | Tools |
| --- | --- |
| Check the connection and identity | `phenoworks_health`, `phenoworks_me` |
| Find research data | `list_projects`, `get_project`, `list_datasets`, `get_dataset`, `get_dataset_summary` |
| Inspect analysis methods | `search_analysis_blocks`, `describe_analysis_block`, `review_analysis_block_code` |
| Check pipeline compatibility | `validate_pipeline_steps` |
| Run and monitor analysis | `run_dataset_pipeline`, `list_pipeline_jobs`, `get_pipeline_job`, `cancel_pipeline_job` |
| Retrieve outputs | `list_artifacts`, `download_artifact` |

Block descriptions and source review preserve the backend's permissions;
those detail routes currently require an administrator. Source review returns
stored code for inspection without executing it.

## Connections and authentication

Use Streamable HTTP when the MCP server runs as a service, or stdio when a local
client launches it as a process. Choose one credential mode: an API key, a bearer
auth token, or per-request credential forwarding over HTTP.

For the integrated agent, a shared HTTP server can forward each user's
`Authorization` or `X-API-Key` header. An external local client can instead use
a dedicated API key. Access checks still happen in the PhenoWorks backend.

## From a request to a result

The assistant finds a dataset, checks the available blocks and input requirements,
and submits a compatible pipeline. The returned `pipeline_id` identifies the
analysis run; `operation_id` identifies the queued operation. Use the pipeline
ID when checking jobs or retrieving their artifacts.

Clients that support form elicitation can present a confirmation before a run.
Clients without that capability can submit directly, so a headless integration
should handle its own approval policy.

## Retrieval scope

MCP retrieves information through the tools listed above. Its dataset summaries
and artifact access support the [Scientific Knowledge Base](scientific-knowledge-base.md),
but do not automatically index every image, PDF, or manuscript in the workspace.

Follow [Connect an MCP Client](../tutorials/connect-mcp.md) for setup and a first
connection check.
