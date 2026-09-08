# Analysis Pipelines

Pipelines connect compatible LgoPy blocks into a repeatable processing workflow.
Use them to transform raw images into structured features, run an image correction,
or produce measurements for downstream analysis.

![Analysis pipelines](../images/analysis-pipelines.svg)

## Build and run a pipeline

1. Inspect available methods in **Analysis Modules**.
2. Open **Analysis Pipelines** and select **Run pipeline**.
3. In **Dataset & Functions**, choose the project, study, dataset, blocks, and versions.
4. In **Functions Ordering**, arrange the processing steps.
5. In **Parameters**, configure each block for your data.
6. In **Pipeline**, review the graph and use **Preview JSON** to inspect the definition.
7. Select **Run pipeline**, then follow the job's progress and output log.

The backend queues runs as durable operations. A configured embedded worker or
Celery worker executes them; submitting a run does not mean it has completed.

## Match inputs and outputs

Each block has its own contract. A block may return a table, a dataset item, or a
status summary while saving images separately. Connect steps only when the next
block can consume the previous output. The validation endpoint
`POST /api/pipelines/validate` and MCP's `validate_pipeline_steps` check catalog
blocks and declared type compatibility without starting a job. They do not
establish that a method is scientifically appropriate for your data.

For example, the bundled `ndvi_index` block returns measurements for multispectral
assets. Its `nir_band` and `red_band` settings are one-based band indices; check
your sensor's band order before running it.

## API payload

A single-block run can use this request body. Replace the dataset ID and verify
the installed block version and band indices:

```json
{
  "dataset_id": 7,
  "pipeline_name": "NDVI plot measurements",
  "pipeline": [
    {
      "block": "ndvi_index",
      "version": "0.1.0",
      "args": {"nir_band": 5, "red_band": 3}
    }
  ]
}
```

Submit to `POST /api/pipelines`, `/api/pipelines/run`, or the dataset-scoped
`/api/pipelines/datasets/7` route. A successful submission returns HTTP `202`
and an operation record. Its `id` is the **operation ID**; the pipeline job ID is
in `payload.pipeline_id`. Use the pipeline ID with
`GET /api/pipelines/{pipeline_id}` to inspect the run.

## Review, rerun, and cancel

The pipeline page provides output logs, artifacts, rerun, cancel, and delete
actions when applicable. A rerun uses the stored pipeline definition. Review
failures before retrying, and keep the relevant block versions available.
Deleting a pipeline queues removal of its registered artifacts, so download
results you need to retain before deleting the run.

Continue with [Running a Workflow](../tutorials/run-workflow.md),
[Results and Exports](results-exports.md), or
[Analyze Data with the Agent](../tutorials/analyze-with-agent.md).
