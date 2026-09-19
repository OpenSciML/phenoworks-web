# Manage LgoPy Modules

**LgoPy Modules** contains a shared catalog and your account's installed modules.
All authenticated users can browse descriptions, authors, tags, versions, README
files, parameter schemas, requirements, and optional citations. Existing module
URLs remain under `/admin/blocks`; browsing those URLs does not require an admin
account.

## Install and update in your account

Use **All modules**, **Installed**, **Not installed**, and **Updates available**
to filter the catalog. Search by purpose or select a category. **Install** adds a
block name to your account; the package files remain shared. The install count
shows the number of accounts currently selecting that name, once per account
across all versions. Stars and download counts are not included.

A new admin-published version automatically becomes available to accounts that
installed the block. **Update** changes your preferred version for new analyses.
You can also choose a specific version in module details and make it the default.
Saved and accepted analyses retain their exact versions. Removing a module from
your account prevents new submissions; accepted runs retain their authorization.

The pipeline picker and agent search use your installed block names. An empty
account selection produces no available analysis blocks. Administrative privileges
do not automatically install modules into an account.

## Source visibility and citations

Source visibility is configured per version as **private** or **public**. It only
controls implementation code: documentation, authors, descriptions, schemas, and
citation metadata remain visible. Private source is accessible to administrators;
other users receive an explanatory HTTP 403 with code `module_source_private`.
They can still execute installed private-source modules. Agents should explain
available documentation without claiming to have inspected private code.

The **Citation** tab displays the author's optional `CITATION.cff` and allows
saving that citation file. If no citation was supplied, the page says so.

## Manage the global catalog

Only admins see **Publish module** and global-removal/source-policy actions.
Upload a built ZIP and choose source visibility (private by default). Identical
package uploads are idempotent; changed content must use a new version so existing
analyses keep a stable implementation. Removal is blocked while the block is
installed in accounts or needed by unfinished runs.

## API and rollout

Existing endpoints retain the `/api/analysis/blocks` prefix:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/analysis/blocks?scope=all` | Shared catalog, account state, and install counts |
| `GET /api/analysis/blocks?scope=installed` | Current account's module versions |
| `GET /api/analysis/blocks/search?scope=installed` | Search installed names before ranking limits |
| `PUT /api/analysis/blocks/{name}/installation` | Install or change default; body `{"version":"1.0.0"}` or `{}` for latest |
| `DELETE /api/analysis/blocks/{name}/installation` | Remove from the current account |
| `PATCH /api/analysis/blocks/{name}/policy?version=1.0.0` | Admin policy; body `{"source_visibility":"public"}` |
| `GET /api/analysis/blocks/{name}/citation?version=1.0.0` | Optional citation text |

The existing ZIP installation endpoint accepts an optional `source_visibility`
form field. Citation responses contain an empty `citation` string when absent.

Apply the new metadata migration before starting the updated API/workers, using
the deployment's existing `phenoworks db upgrade` command. The first updated
container backfills pre-migration accounts with the available catalog names and
their latest stable versions. The backfill is one-time; new accounts start empty.
Missing source policies default to private. Deploy the updated LgoPy and
`lgopy-catalog` alongside PhenoWorks so `allowed_blocks` and optional package files
are supported consistently by API and worker processes.
