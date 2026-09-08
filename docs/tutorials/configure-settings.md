# Tutorial: Configuring Settings

Configure the application, storage, and agent connections for your environment.
Start from the repository's sample settings and use addresses that are reachable
from the process that consumes them.

## 1. Configure the workspace

If you do not already have a root `.env`, copy `.env.sample.local`. Set the database
connection, `PHENOWORKS_DATA_DIR`, and `PHENOWORKS_APP_CONFIG_FILE`. The default
branding file is `themes/phenoworks.config.json`.

Keep the database and data directory consistent between the API and worker.
The block catalog defaults to the `blocks/` directory under the data root, unless
`PHENOWORKS_ANALYSIS_BLOCK_CATALOG_DIR` overrides it.

## 2. Configure browser connections

Set the frontend's API, upload, and agent WebSocket addresses for your setup.
For host-based local processes, the sample uses:

```dotenv
NEXT_PUBLIC_PHENOWORKS_API_BASE_URL=http://127.0.0.1:9000/api
NEXT_PUBLIC_PHENOWORKS_AGENT_WS_BASE_URL=ws://127.0.0.1:9000/api/agent/ws
NEXT_PUBLIC_PHENOWORKS_TUSD_ENDPOINT=http://localhost:1080/files/
```

Compose uses container service addresses internally and configures the frontend
API proxy separately. For an HTTPS site, the browser's agent connection needs a
reachable `wss://` endpoint. Rebuild a production UI after changing public build
settings. Keep `AUTH_SECRET` and `NEXTAUTH_SECRET` stable between restarts.

## 3. Connect the Agent and MCP

For an API and MCP server running directly on your host:

```dotenv
PHENOWORKS_AGENT_MCP_URL=http://127.0.0.1:8787/mcp
PHENOWORKS_AGENT_MODEL_NAME=gemini/gemini-2.5-flash
GOOGLE_API_KEY=<your-provider-key>
```

Inside the bundled Compose API container, use `http://mcp:8787/mcp` instead.
The API must have the agent package installed. Configure a different model or
gateway with `PHENOWORKS_AGENT_MODEL_NAME`, `PHENOWORKS_AGENT_LLM_API_BASE`, and
`PHENOWORKS_AGENT_LLM_API_KEY` where needed.

Follow [Connect an MCP Client](connect-mcp.md) to configure the server's credential
mode. If you set `PHENOWORKS_AGENT_MCP_ALLOWED_TOOLS`, include the tools needed
for your workflow, including block description and source review when desired.
Restart affected services and start a new conversation after tool changes.

## 4. Verify the setup

1. Open the application and check its title and theme.
2. Inspect `/api/config` if the branding differs from your selected file.
3. Sign in and open a dataset to check storage and visualization.
4. Ask the Agent to list your accessible projects.
5. Run a small compatible pipeline to confirm the worker and artifact storage.

For an external assistant or scripted access, create a dedicated
[API key](../features/users-api-keys.md). A successful chat response alone does
not verify the MCP connection or the pipeline worker; check those separately.
