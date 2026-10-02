# Manage LgoPy Modules

**Modules** in the sidebar opens **Analytical Modules**, the shared catalog of
LgoPy analysis modules and your account's installations. All authenticated users
can browse descriptions, authors, tags, versions, README files, parameter
schemas, requirements, supported inputs, and optional citations. Module pages
live under `/admin/blocks`; browsing them does not require an admin account.

## Find a module

Use the tabs to choose a view:

| Tab | Shows |
| --- | --- |
| **Discover** | The whole catalog. |
| **My modules** | Modules installed in your account. |
| **Not installed** | Catalog modules you have not installed. |
| **Updates** | Installed modules with a newer published version. |

Type a purpose in **Search the module marketplace…**, such as "canopy cover",
for a semantic search of the catalog. Select **Filters** to narrow the list:

- **Category**: the module's catalog groups.
- **Modality** and **Data product**: the sensor and file type the module reads.
  Choosing a modality narrows the data products to those modules accept with it.
- **Sort by**: **Name** (**Relevance** while searching) or **Most installed**.

Modality and data product filters match each module's **supported inputs**, a
list of `modality:data_product` pairs declared by its author. `rgb:image` reads
RGB images; `multispectral:orthomosaic` reads multispectral orthomosaics; and
`*:point_cloud` reads point clouds from any sensor. A module that lists no pairs
reads no files, and the details panel shows "No asset input required". See
[Build Custom LgoPy Blocks](build-custom-lgopy-blocks.md#runtime-properties-in-extras)
for how authors declare them.

## Install and update in your account

Select **Install** on a module card to add it to your account; the package files
remain shared. The card shows how many accounts have installed the module,
counting each account once across all versions.

Open an installed module (**Manage**, or **View update** when an update exists)
to change versions:

- **Update to &lt;version&gt;** makes the latest version your default for new analyses.
- The **Version** dropdown in **Module details** opens another version.
  **Use v&lt;version&gt; by default** makes it your default.
- **Uninstall** removes the module from your account and prevents new
  submissions. Accepted runs keep their authorization.

A newly published version becomes available to accounts that installed the
module. Saved and accepted analyses keep their exact versions.

The Editor's **Run Analysis** wizard and the Agent's module search use your
installed modules. The **Set up an analysis** guide on **Home** lists every
catalog module compatible with your data and installs the ones you select when
the run starts. Administrative privileges do not install modules into an account
automatically.

## Inspect a module

The details page has three tabs:

- **Documentation**: the module's README.
- **Source code**: the implementation, when its source is public.
- **Citation**: the author's optional `CITATION.cff`, with **Download CITATION.cff**.
  If no citation was supplied, the tab says so.

**Module details** lists the package name, version, category, supported inputs,
and class. **View manifest** and **View requirements** show the package's
`manifest.json` and Python dependencies.

## Source visibility

Each version's source is **public** or **private**; the details page shows
"Public source" or "Private source". Visibility only controls implementation
code: documentation, authors, descriptions, schemas, supported inputs, and
citation metadata remain visible. Private source is accessible to
administrators; other users receive an explanatory HTTP 403 with code
`module_source_private`. They can still run installed private-source modules.
Agents explain private modules from their documentation and do not claim to have
inspected the code.

## Manage the global catalog

Administrators see these additional actions:

- **Publish module** opens **Publish to global catalog**. Choose the built ZIP,
  optionally override its name or version, and select **Publish**. Modules are
  public unless you check **Private module**.
- **Make Public** and **Make Private** change a version's source visibility.
- **Unpublish this version** removes a version from the catalog. Removal is
  blocked while the module is installed in accounts or needed by unfinished runs.

Identical package uploads are idempotent; changed content must use a new version
so existing analyses keep a stable implementation. The Python SDK CLI publishes
the same way with `phenoworks analysis-blocks install ./module.zip`.

## API

The module endpoints use the `/api/analysis/blocks` prefix:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/analysis/blocks?scope=all` | Shared catalog, account state, and install counts |
| `GET /api/analysis/blocks?scope=installed` | Current account's module versions |
| `GET /api/analysis/blocks/search?scope=installed` | Search installed modules; also filters by `category`, `modality`, and `data_product` |
| `PUT /api/analysis/blocks/{name}/installation` | Install or change default; body `{"version":"1.0.0"}` or `{}` for latest |
| `DELETE /api/analysis/blocks/{name}/installation` | Remove from the current account |
| `POST /api/analysis/blocks/install` | Admin: publish a ZIP, with an optional `source_visibility` form field (`private` when omitted) |
| `PATCH /api/analysis/blocks/{name}/policy?version=1.0.0` | Admin policy; body `{"source_visibility":"public"}` |
| `DELETE /api/analysis/blocks/{name}` | Admin: unpublish |
| `GET /api/analysis/blocks/{name}/citation?version=1.0.0` | Optional citation text; an empty `citation` string when absent |

Deploy the updated LgoPy and `lgopy-catalog` alongside PhenoWorks so supported
inputs, categories, and optional package files are handled consistently by the
API and worker processes.
