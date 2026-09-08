# Tutorial: Running a Workflow

Run a small image-processing pipeline, follow its progress, and inspect the
outputs. This example uses the bundled **Histogram Equalization** block to
produce enhanced RGB images and a result table.

## Before you start

You need a project with an accessible dataset containing RGB plot assets, an
installed `histogram_equalization` block, and a running worker. Review a few
images first. Histogram equalization changes contrast; whether it improves a
particular dataset needs visual assessment.

## 1. Choose the dataset and method

Open **Analysis Modules** and find **Histogram Equalization**. Confirm its
version and input requirements. The source example is
`blocks/image_analysis/histogram_equalization.py`; an administrator can install
its package if it is missing from the catalog.

Open **Analysis Pipelines**, select **Run pipeline**, and use **Dataset & Functions**
to choose the project, study, dataset, and block version.

## 2. Review the pipeline

Continue through **Functions Ordering** and **Parameters**. This example has one
block and does not need a chain of processing steps. In **Pipeline**, inspect
the graph and select **Preview JSON** to check the dataset and block definition.

When adding more blocks, verify that each output matches the next input. An
image saved as an artifact is not necessarily the value returned to the next step.

## 3. Run and monitor

Select **Run pipeline**. Find the new job in the pipeline list and open
**View output log** to follow its progress. The request is queued for the worker,
so allow the job to finish before interpreting the outputs.

If it fails, read the error message and confirm the dataset's asset structure,
file accessibility, and block dependencies before retrying.

## 4. Inspect the result

Open the run's artifacts. The block saves enhanced PNG images and returns a table
with one row per processed RGB asset. The worker saves DataFrame results as an
Excel workbook. Compare an enhanced image with its original before applying the
same workflow more broadly.

![Analysis pipelines](../images/analysis-pipelines.svg)

## Try feature extraction next

For multispectral data, an installed `ndvi_index` block can calculate vegetation-index
statistics. Check the one-based NIR and red band indices against your sensor's
band order. RGB images alone do not supply a near-infrared band.

Continue with [Viewing and Exporting Results](view-export-results.md), or run
an analysis conversationally with the [Agent](analyze-with-agent.md).
