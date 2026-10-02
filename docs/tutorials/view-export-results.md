# Tutorial: Viewing and Exporting Results

Inspect a completed pipeline run, find and download its outputs, and keep
enough context to reuse the results in analysis or writing.

## Before you start

You need access to the project and a pipeline run that has produced artifacts.
If you have not run one yet, follow [Running a Workflow](run-workflow.md).

## Review the run

1. Open **Jobs**. Use the **Completed** tab, **Search jobs**, or the
   **Job type** filter (**Pipeline run**) to find the run.
2. The **Job** column shows the run's name and ID, such as
   `Pipeline run · #42`. **Status** reads **Completed** when the worker has
   finished; **Duration** shows how long it took.
3. Select the row, or **View details and log** in its ⋮ menu. The details show
   when the run was scheduled, started, and finished, its **Inputs and settings**,
   and the **Processing log**. Use **Copy log** to share messages or errors.
4. Select **View artifacts** to open the run's **Artifacts** page.

## Find the outputs

The **Artifacts** table lists every file the run produced, with its **Type**,
**Format**, **Status**, and creation time. For each artifact you can
**View artifact details**, **Preview artifact content** (images and text), or
**Download artifact**. An artifact is downloadable once its status reads `ready`.

Runs that process many plots can produce hundreds of files. Narrow them with the
controls above the table:

- **Filter field** and **Filter value** keep artifacts with one exact value,
  such as `Associations · plot_id` or a metadata field a module recorded.
- **Group by** collects artifacts into collapsible groups by a field, such as
  `Metadata · survey`, showing how many artifacts each group holds.

The available fields come from the run's associations (project, study, dataset,
pipeline run, and plot) and from the metadata each module saved with its
outputs. Module authors choose that metadata; see
[Describe the outputs](build-custom-lgopy-blocks.md#describe-the-outputs).

## What a run produces

Every run writes its definition, context, and results:

| Type | File | Contents |
| --- | --- | --- |
| Pipeline setup | `pipeline.json` | The submitted modules, versions, and parameters |
| Pipeline Context | `context.json` | The runtime context the pipeline executed in |
| Results | `pipeline_results.xlsx` | The measurements the modules returned, one row per processed plot or file. Results that are not tables are saved as `pipeline_results.json`. |

Depending on the modules, a run can also produce:

| Type | File | Contents |
| --- | --- | --- |
| Run details | `run_metadata.json` | Values the modules recorded in the metadata store |
| Analysis output, or the module's own type | Images, masks, tables, or other files | Files saved by a module, often one per plot. A module can set its own type, such as `plot_hsv_image`, shown as **Plot Hsv Image**. |
| Results | `results/*.xlsx` | Nested tables a module returned |

A [batched run](batched-item-pipelines.md) writes one results file per batch
and a `results.json` manifest instead of a single workbook.

Keeping `pipeline.json` alongside the results is what makes a run reproducible:
it records the module versions and parameter values, so you can rerun or audit
the analysis later without relying on memory. **Rerun pipeline** in the run's ⋮
menu on **Jobs** submits the same definition again.

## Keep the context

Record the dataset, modules, versions, and parameters with your downloaded
files. Before comparing two tables, check units, plot IDs, survey dates, and
whether both runs used comparable methods.

The **Jobs** table shows the project but not the dataset. Read the dataset and
modules from **Inputs and settings** in the run's details, or from
`pipeline.json`. Runs started from **Home** are named after their dataset; runs
started from the Editor are named after the time they started.

## Continue with the Agent or MCP

Ask the Agent to retrieve the run and explain a specific output:

> Find the results from pipeline run 42 and help me understand the plot measurements.

The run ID is the number shown in the **Job** column. When the Agent downloads
an artifact, a button named after the file appears in the chat; select it to
save the file through your browser.

An MCP client uses `list_artifacts` (filtered by the run ID) and
`download_artifact`. Files downloaded by an MCP client are stored on the MCP
host, which may differ from your laptop. The Python and R clients download
artifacts with `client.artifacts.download(...)`.

Use the reviewed evidence for [downstream analysis](analyze-with-agent.md) or
drafting a research section.
