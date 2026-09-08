# Results and Exports

PhenoWorks keeps generated outputs linked to the dataset, plot, and pipeline
that produced them. These files are the starting point for further analysis,
interpretation, figures, and research writing.

![Pipeline artifacts](../images/results-artifacts.svg)

## What a run can produce

| Output | Use |
| --- | --- |
| Images and masks | Inspect transformations or review image-processing results |
| Feature tables | Compare measurements across plots, dates, or treatments |
| JSON summaries | Review structured results and processing metadata |
| Run logs | Follow execution and investigate errors |
| Method records | Trace the pipeline definition and processing context |

Outputs depend on the selected blocks. The pipeline worker saves returned
DataFrames as Excel workbooks and other serializable results as JSON. Blocks
can also save additional artifacts, such as enhanced images.

## Find and download results

1. Open **Analysis Pipelines** and find the relevant run.
2. Check its status and **View output log**.
3. Open its artifacts and inspect their details.
4. Preview supported text content or download the output file.
5. Retain the dataset, run, method version, and parameter context with exported results.

## Use the results

Download feature tables for notebooks or statistical software, or ask the
[PhenoWorks Agent](phenoworks-agent.md) to retrieve available outputs and help
interpret them. It can also help draft preliminary-data sections for manuscripts
and grant proposals from selected evidence.

[MCP](phenoworks-mcp.md) exposes `list_artifacts` and `download_artifact` for
compatible clients. Downloads are written on the MCP host; a remote client may
need shared storage or another transfer step to access those files.

See [Viewing and Exporting Results](../tutorials/view-export-results.md) and
[Draft Research Sections](../tutorials/draft-research-sections.md).
