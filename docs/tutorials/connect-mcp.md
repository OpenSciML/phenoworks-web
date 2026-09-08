# Tutorial: Connect an MCP Client

Connect an MCP-compatible assistant to your PhenoWorks workspace, then verify
that it can find your datasets. This tutorial uses the source package in the
repository, so it does not depend on a package-registry release.

## Before you start

You need a running PhenoWorks API, Python 3.11 or later, `uv`, and an MCP client.
Create an API key under **Settings → API Keys** for the account that will access
the project. Use the actual API address for your installation; the examples below
use `http://localhost:9000/api`.

## Option A: let a local client launch the server

If your client accepts an `mcpServers` configuration, adapt this example. Replace
the project path and token, and use the client's secret-management mechanism
where available:

```json
{
  "mcpServers": {
    "phenoworks": {
      "command": "uv",
      "args": [
        "run",
        "--project", "/absolute/path/to/phenoworks/packages/phenoworks-mcp",
        "phenoworks-mcp",
        "--transport", "stdio",
        "--api-base-url", "http://localhost:9000/api"
      ],
      "env": {
        "PHENOWORKS_API_KEY": "<your-api-key>"
      }
    }
  }
}
```

The client starts and stops this process. Configuration formats vary by client;
the command, arguments, and environment values remain the same.

## Option B: connect to an HTTP server

From the repository root, with `PHENOWORKS_API_KEY` set in the environment:

```bash
uv run --project packages/phenoworks-mcp phenoworks-mcp \
  --api-base-url http://localhost:9000/api \
  --host 127.0.0.1 --port 8787 --path /mcp
```

Connect your client to `http://127.0.0.1:8787/mcp` using Streamable HTTP.
This process uses the configured API key for its requests.

For the integrated agent or a shared service that forwards each caller's
credential, unset fixed API-key and auth-token settings and instead run:

```bash
uv run --project packages/phenoworks-mcp phenoworks-mcp \
  --api-base-url http://localhost:9000/api \
  --forward-auth-headers \
  --host 127.0.0.1 --port 8787 --path /mcp
```

Each client must then send either `Authorization: Bearer <token>` or
`X-API-Key: <key>` with its MCP requests. Do not combine forwarding with a fixed
server credential. The bundled Compose MCP service already uses forwarding.

## Check the connection

Ask the client to call `phenoworks_health` and `phenoworks_me`, then list your
projects. Confirm the authenticated identity and choose a dataset you can access.

> Show my projects and summarize the available data in dataset 7.

Replace `7` with your dataset ID. A permission error on block details or source
review may mean the account lacks administrator access, rather than a connection
failure.

## Connect the built-in Agent

Set the API's `PHENOWORKS_AGENT_MCP_URL` to the HTTP MCP endpoint it can reach.
For the bundled Compose services, that is `http://mcp:8787/mcp`; for host processes,
it may be `http://127.0.0.1:8787/mcp`. Configure the model provider separately and
start a new chat to discover the tools.

Next, [analyze a dataset with the Agent](analyze-with-agent.md). See the
[MCP feature reference](../features/phenoworks-mcp.md) for tool names and retrieval scope.
