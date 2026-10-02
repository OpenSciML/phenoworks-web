# Tutorial: Running Analysis Workflows

Choose analysis modules for a dataset, set their parameters, and start a
pipeline run. This example uses the **NDVI Index** module to calculate
vegetation-index statistics from multispectral orthomosaics or plot images.

There are two ways to start a run:

- **Home → Set up an analysis**: a guided flow that starts from your sensors,
  uploads the data, and offers only the modules that can read it.
- **Editor → Run Analysis**: a three-step wizard for a dataset that already
  holds data, using the modules installed in your account.

Both create a pipeline run that you follow on the **Jobs** page.

## Before you start

You need a project with a dataset you can access, or the files to create one,
and a running worker. Modules come from the shared catalog; an administrator
must publish a module before anyone can select it.

NDVI needs red and near-infrared bands. Check the one-based NIR and red band
indices against your sensor's band order before running. RGB imagery alone does
not supply a near-infrared band.

## Which modules can read my data?

Every dataset file has a **modality** (the sensor, such as `multispectral`) and
a **data product** (what the file is, such as `orthomosaic`). Every module
declares the pairs it reads as **supported inputs**; NDVI Index declares
`multispectral:orthomosaic` and `multispectral:image`. A module can process a
dataset when at least one of its pairs matches the dataset's files.

The Home guide applies this check for you. In the Editor wizard, compare the
module's **Supported inputs** on its **Modules** page with the dataset's files
before you select it. During a run, item-level modules skip plots and files
with no matching input.

## Option A: the guided setup on Home

Open **Home** and follow **Set up an analysis**. The guide has seven steps:

1. **Platform**: how the data was collected: proximal (ground), aerial, or satellite.
2. **Sensors**: the sensors you used. For each sensor, select
   **Choose data products** and check the formats you have. The step reports how
   many analyses are available for your data.
3. **Project**: under **New project**, enter a project, study, and dataset name;
   or pick them under **Existing project**. Select **Create and continue**.
4. **Upload**: add the files as a single file, a ZIP organized by plot, or a
   field-wide map with plot boundaries. See [Importing Data](import-data.md).
5. **Analyses**: the list is filtered to modules that support your sensors and
   data formats. The **Input filters** panel shows each pair, such as
   **Multispectral · Orthomosaic**; pairs with no uploaded files appear dashed.
   Search for a goal, such as "vegetation index", and select **Select** on
   **NDVI Index**. Set **Nir Band** and **Red Band**, then select
   **Add analysis**. Selected modules appear as numbered steps under
   **Selected analyses**; use **Parameters** to change them later.
6. **Review**: check the inputs, analyses, and parameters, then tick
   **I confirm these inputs, analyses, and parameters.**
7. **Run**: select **Run analysis**.

Modules marked **Not installed** are installed in your account when the run
starts. The run sends only the files matching the selected input pairs to the
pipeline.

When the run is submitted, the guide offers **Follow progress in Jobs**,
**Visualize your data in the Editor**, and **Ask the Agent about your data**.

## Option B: Run Analysis from the Editor

Use this route for a dataset that already contains files.

### 1. Install the module

Open **Modules**, find **NDVI Index** under **Discover**, and select **Install**.
The wizard lists only modules installed in your account. See
[Manage LgoPy Modules](./manage-modules.md) for versions, citations, and
supported inputs.

### 2. Choose the functions

Open **Editor**, right-click the dataset in the data tree, and select
**Run Analysis**. The dialog opens on **Functions** with the dataset already
selected. (When the dataset is not preselected, the step is called
**Dataset & Functions** and asks for the **Project**, **Study**, and
**Select Dataset**.)

Under **Available Functions**, search or pick a **Category**, then check
**NDVI Index**. Select **Next**.

### 3. Order the steps

**Order** lists the selected modules. Use the arrows to change their order and
the **Version** dropdown to pin a module version. When you chain modules, check
that each output matches the next input: an image saved as an artifact is not
necessarily the value passed to the next step. Select **Next**.

### 4. Set the parameters

Under **Function parameters**, enter the inputs each module needs. NDVI Index
takes the one-based band indices for the near-infrared and red bands.

Select **Run Analysis**. The data tree shows **Pipeline run scheduled.** with a
**View jobs** button.

## Monitor and inspect the result

Open **Jobs**. The new run appears with the type **Pipeline run** and its ID,
such as `#42`; the same ID identifies the run in the SDKs, the API, and the
Agent. **Active** lists runs that are pending, queued, or running.

Select the row, or **View details and log** in its ⋮ menu, to follow the
**Processing log**. The request is queued for a worker, so allow the run to
finish before interpreting its outputs.

If it fails, read the error in the log. Check that the dataset contains files
matching the module's supported inputs, that the band indices fit the sensor,
and that the module's dependencies installed. Fix the cause, then use
**Rerun pipeline** from the ⋮ menu.

When the run reads **Completed**, select **View artifacts**. Tabular results are
saved as an Excel workbook; [Viewing and Exporting Results](view-export-results.md)
describes every output.

## Run from code

The Python and R clients and the CLI submit the same pipeline definition:

```bash
phenoworks pipeline-runs run --dataset-id 42 --file pipeline.json --wait
```

In Python, pass `data_products=["orthomosaic"]` or `modalities=["multispectral"]`
to `client.run_pipeline(...)` to send blocks only part of each plot.

For large datasets of independent plots, add `"batch_size"` to the run's
`parameters`; see [batched pipeline execution](batched-item-pipelines.md).

## Try image processing next

For RGB data, the bundled `histogram_equalization` module adjusts contrast and
returns a table with one row per processed image. Its source is
`blocks/image_analysis/histogram_equalization.py`. Review a few images first:
whether histogram equalization improves a particular dataset needs visual
assessment.

Continue with [Viewing and Exporting Results](view-export-results.md), or run an
analysis conversationally with the [Agent](analyze-with-agent.md).
