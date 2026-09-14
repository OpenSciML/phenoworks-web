# Run item-level pipelines in batches

Batching bounds the number of plots loaded and processed at once. It is opt-in:
existing pipelines retain full-dataset execution unless their run parameters
include `batch_size`.

## Declare compatible blocks

Every executable block in a batched pipeline must declare:

```python
extras = {
    "transform_scope": "dataset_item",
    "batch_independent": True,
}
```

This is a promise by the block author that processing independent batches gives
the same per-item analysis as processing all items together. Input shape alone
is not enough. Blocks that fit across the dataset, normalize using dataset-wide
statistics, depend on earlier batches' metadata, or carry state between plots
must not make this declaration. Such blocks require full-dataset execution or
a separately designed aggregation stage.

The runner creates fresh block instances and fresh runtime stores for every
batch. Metadata is scoped to that batch. The Image to HSV, histogram equalization,
RGB vegetation coverage, and item artifact/metadata examples declare this
capability in the updated source. Use item-specific artifact and metadata keys;
writing the same key twice replaces its earlier value within that batch. Rebuild and reinstall existing catalog packages
to use their updated declarations.

## Request a batch size

Include the setting in the pipeline request's existing `parameters` object:

```json
{
  "parameters": {
    "batch_size": 32
  }
}
```

The accepted range is 1–10,000 plots. The rest of the pipeline request is unchanged.
Every step is checked before dataset pages are fetched. An incompatible pipeline
fails with an explanation; removing `batch_size` restores full-dataset execution.

The adapter fetches plots in descending ID order using a keyset cursor, then
loads only their assets. It does not load all plots and split them afterward.
A batch size bounds plot count, not bytes: a single plot can still contain large
images or many assets. Avoid modifying dataset membership or input assets while
an analysis is running; paging does not create a database snapshot of the inputs.

## Outputs and checkpoints

Artifact files are written as blocks produce them. After each batch, its artifact,
metadata, and result records are committed with a checkpoint in a short database
transaction. The checkpoint includes completed batches and processed item counts.
Runtime stores and batch results are released before the next page is fetched.

Batch records remain pending and are excluded from artifact listing and content
access until the entire pipeline succeeds. Finalization publishes them together
with successful run status. Results are separate JSON or Excel batch artifacts;
the final JSON manifest gives counts and the batch output folder. The runner does
not concatenate all results into an in-memory table or a single Excel workbook.

## Failure and file cleanup

Before creating files, the runner persists a unique execution-attempt folder in
the pipeline record. Every batch writes beneath that folder. If processing or a
batch/final database commit fails, the runner marks the attempt for cleanup,
deletes its entire folder—including partial files that never received database
records—and removes its staged records.

If cleanup fails, its persisted marker is retained. Workers retry cleanup for
failed/cancelled runs at startup. A retried interrupted run cleans its previous
attempt before starting a new attempt. Retries currently restart from the first
batch; checkpoints are for progress and recovery, not partial-run resume.
Successful sibling attempts are never deleted by failed-attempt cleanup.
Explicit pipeline deletion also removes its attempt folder before deleting the
pipeline record. If its worker is still executing a batch, deletion preserves
the record and asks you to retry after the batch stops. This prevents losing
cleanup ownership while a worker can still create files.

A worker crash may leave files until recovery runs. Database rollback cannot undo
filesystem or object-storage writes; durable folder ownership and repeatable
cleanup provide that recovery path.
