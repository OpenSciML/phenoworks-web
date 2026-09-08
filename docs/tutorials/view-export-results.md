# Tutorial: Viewing and Exporting Results

Inspect a completed pipeline, download its outputs, and keep enough context to
reuse the results in analysis or writing.

## Before you start

You need access to the project and a pipeline that has produced artifacts. If
you have not run one yet, follow [Running a Workflow](run-workflow.md).

## Review the run

1. Open **Analysis Pipelines** and find the run for your dataset.
2. Check its status, then select **View output log**.
3. Review messages, warnings, and any error details.
4. Open the run's artifacts and inspect the available files.
5. Preview supported text content or select **Download artifact**.

![Pipeline artifacts](../images/results-artifacts.svg)

The files depend on the blocks used. An image-processing run may produce PNG or
JPEG files; a feature-extraction block may return measurements saved as an Excel
workbook. Other serializable results are stored as JSON.

## Keep the context

Record the dataset, pipeline, block versions, and parameters with your downloaded
files. Before comparing two tables, check units, plot labels, acquisition dates,
and whether both runs used comparable methods.

## Continue with the Agent or MCP

Ask the agent to retrieve the run and explain a specific output:

> Find the results from pipeline 12 and help me understand the plot measurements.

An MCP client can use `list_artifacts` and `download_artifact`. Downloaded files
are stored on the MCP host, which may differ from your laptop. The browser's
download action saves files through your browser.

Use the reviewed evidence for [downstream analysis](../features/results-exports.md)
or [drafting a research section](draft-research-sections.md).
