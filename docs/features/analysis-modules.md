# Analysis Modules

Analysis modules are reusable, versioned LgoPy components that can be searched, inspected, installed, and removed from PhenoWorks.

![Analysis modules](../images/analysis-modules.svg)

PhenoWorks treats analysis modules as a modular method layer for research workflows. The platform stays crop-agnostic, while crop-specific measurements are added as LgoPy components that can be packaged, installed, searched, reviewed, and combined in pipelines.

![LgoPy modular analysis extensibility](../images/lgopy-building-blocks.svg)

## When to Use

Use analysis modules when you want reusable methods for vegetation indices, canopy metrics, spectral feature extraction, quality control, or crop-specific trait estimation in a dataset pipeline.

## Step-by-Step Usage

1. Open **Analysis Modules**.
2. Search the installed catalog.
3. Inspect a module manifest to verify name, version, schema, and metadata.
4. View source when you need to understand implementation details.
5. View requirements before installing or running a module with optional dependencies.
6. Install a zipped module package when adding a new analytical component.
7. Remove outdated modules when they should no longer be available.

## Processing and feature extraction examples

The repository includes source examples that an administrator can package and
install. Availability in the UI depends on the installed catalog.

| Block | Input and output |
| --- | --- |
| `histogram_equalization` | RGB plot images → enhanced PNG artifacts and a result table |
| `image_2_hsv` | RGB plot images → HSV-channel JPEG visualizations and a status summary |
| `ndvi_index` | Multispectral plot assets → vegetation-index measurements |

Use images to inspect a transformation and structured measurements for downstream
analysis. Check each block's return type before connecting it to the next step;
saving an image artifact does not mean the block returns an image.

The [LgoPy block tutorial](/blog/building-custom-lgopy-blocks) explains how to
package a method. The [Agent](phenoworks-agent.md) and [MCP](phenoworks-mcp.md)
can help discover installed blocks and inspect their inputs. Detailed metadata
and source inspection through the API currently require administrator access.

## CLI Usage

Inspect the current LgoPy catalog directory, semantic-search status, embedding model, and pgvector database target:

```bash
phenoworks analysis-blocks config
```

List or search installed blocks:

```bash
phenoworks analysis-blocks list
phenoworks analysis-blocks search "vegetation index"
phenoworks analysis-blocks search --category spectral --tag ndvi
```

Build and install the vegetation-index blocks from the repository root:

```bash
uv run phenoworks analysis-blocks install-sources blocks/vegetation_indices \
  --build-dir /tmp/phenoworks-block-builds
```

Source blocks are grouped under `blocks/` by purpose: `vegetation_indices`,
`image_analysis`, `phenobox`, `metadata`, `examples`, and `turf`. Use `blocks`
instead of a category path to install all categories. Keep generated packages
outside the source tree.

To install an existing package directory, use
`phenoworks analysis-blocks install <package-directory>`. Upload ZIP archives
through **Analysis Modules** in the web workspace.

Inspect implementation details before using a block:

```bash
phenoworks analysis-blocks source ndvi_index --version 0.1.0
phenoworks analysis-blocks requirements ndvi_index --version 0.1.0
```

Remove a module version when it should no longer be available:

```bash
phenoworks analysis-blocks remove ndvi_index --version 0.1.0
```

## LgoPy Vector Index

The file-backed catalog stores installed module packages under `PHENOWORKS_ANALYSIS_BLOCK_CATALOG_DIR`, defaulting to the `blocks/` directory under `PHENOWORKS_DATA_DIR`.

For semantic search, PhenoWorks bridges its PostgreSQL settings into the LgoPy catalog vector-index environment:

| LgoPy variable | Source |
| --- | --- |
| `LGOPY_CATALOG_DB_DRIVER` | Derived from `PHENOWORKS_DATABASE_URL` or PostgreSQL settings. |
| `LGOPY_CATALOG_DB_HOST` | `PHENOWORKS_DB_HOST` |
| `LGOPY_CATALOG_DB_PORT` | `PHENOWORKS_DB_PORT` |
| `LGOPY_CATALOG_DB_NAME` | `PHENOWORKS_DB_NAME` |
| `LGOPY_CATALOG_DB_USER` | `PHENOWORKS_DB_USER` |
| `LGOPY_CATALOG_DB_PASSWORD` | `PHENOWORKS_DB_PASSWORD` |

Set `GOOGLE_API_KEY` to enable Gemini embeddings for semantic discovery of analytical methods. Optionally set `LGOPY_CATALOG_GEMINI_EMBEDDING_MODEL_ID`; otherwise PhenoWorks uses `gemini-embedding-001`.

## Best Practices

- Review requirements before running externally developed modules.
- Use versioned module packages for reproducible pipeline runs.
- Keep module display names concise and descriptions specific.
- Prefer focused, composable modules over one large analysis script.
- Keep module inputs explicit so the pipeline wizard can expose clear controls.

## Limitations

- A module must expose a compatible manifest and schema to appear correctly in the pipeline wizard.
- Dependency installation may require the local environment to satisfy package requirements.
- Semantic search requires PostgreSQL plus `GOOGLE_API_KEY`; deterministic catalog search works without embeddings.
