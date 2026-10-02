---
slug: python-and-r-sdks
title: "Introducing the PhenoWorks SDKs for Python and R"
description: "Bring PhenoWorks into your notebooks and scripts: discover datasets, upload files, run analysis pipelines, and download results with our Python and native R clients."
authors: [haruiz]
tags: [release-notes, documentation]
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

Crop phenotyping research rarely stays in one application. You might organize
field trials in PhenoWorks, explore measurements in a Python notebook, and fit
a statistical model in R. Moving between those tools should not mean repeatedly
downloading files by hand or writing the same HTTP requests for every project.

The **PhenoWorks SDKs for Python and R** bring projects, datasets, files, and
analysis pipelines into your existing scripts. Browse data, submit a workflow,
wait for its results, and download the outputs for your next analysis—all through
your PhenoWorks account.

{/* truncate */}

The Python package, **`phenoworks-sdk` 0.1.1**, is available on
[PyPI](https://pypi.org/project/phenoworks-sdk/). The native R package,
**`phenoworks` 0.1.1**, is available as a
[source download](/downloads/phenoworks_0.1.1.tar.gz) while we work through the
CRAN submission process. CRAN publication is not yet confirmed; the R
installation instructions below use that source archive.

## Two languages, the same research workflow

Both clients let you work with projects, studies, datasets, dataset files,
surveys, plots, annotations, and pipeline runs. They handle API authentication and provide
methods for file transfers and pipeline monitoring. Python returns familiar
dictionaries and lists; R returns ordinary lists that you can inspect and
transform with your preferred tools.

The R client is native R and does not require Python. The Python package also
includes an asynchronous client and an optional command-line interface.

The SDKs connect to a running PhenoWorks server. You will need its URL, an
account, and an API key created in your account settings. Your account's access
permissions still apply, and analysis pipelines execute on the server's workers.
Installing an SDK does not install a PhenoWorks server.

## Install the client

<Tabs groupId="sdk-language">
<TabItem value="python" label="Python" default>

Use Python 3.11 or newer:

```bash
pip install phenoworks-sdk
```

To include the optional CLI:

```bash
pip install 'phenoworks-sdk[cli]'
```

</TabItem>
<TabItem value="r" label="R">

Use R 4.1 or newer. Install the dependencies first, then install the source
package from this website:

```r
install.packages(
  c("httr2", "curl", "openssl", "mime"),
  repos = "https://cloud.r-project.org"
)

install.packages(
  "https://phenoworks.org/downloads/phenoworks_0.1.1.tar.gz",
  repos = NULL,
  type = "source"
)

library(phenoworks)
```

The PhenoWorks R package contains no compiled code. If your system installs its
dependencies from source, those dependencies may need system libraries or build
tools.

</TabItem>
</Tabs>

## Connect and discover your data

Both SDKs recognize `PHENOWORKS_API_URL` and `PHENOWORKS_API_KEY`. Set them in the
environment that launches your terminal, notebook, or R session. For example,
in a shell:

```bash
export PHENOWORKS_API_URL="https://your-phenoworks-server"
export PHENOWORKS_API_KEY="YOUR_API_KEY"
```

Replace the placeholders with your own connection details. Keep the real API
key out of scripts and notebooks that you share. The URL should point to your
PhenoWorks server, which may differ from the public project website.

Start by listing the projects you can access.

<Tabs groupId="sdk-language">
<TabItem value="python" label="Python" default>

```python
from phenoworks_sdk import PhenoWorksClient

with PhenoWorksClient() as client:
    for project in client.projects.list():
        print(project["id"], project["name"])
```

</TabItem>
<TabItem value="r" label="R">

```r
library(phenoworks)

client <- phenoworks_client()
projects <- client$projects$list()
print(projects)
```

</TabItem>
</Tabs>

Next, find datasets by modality. Replace project ID `7` with one returned by
your server.

<Tabs groupId="sdk-language">
<TabItem value="python" label="Python" default>

```python
with PhenoWorksClient() as client:
    datasets = client.datasets.filter_by_modality("thermal", project_id=7)
    for dataset in datasets:
        print(dataset["id"], dataset["name"])
```

</TabItem>
<TabItem value="r" label="R">

```r
datasets <- client$datasets$filter_by_modality("thermal", project_id = 7)
print(datasets)
```

</TabItem>
</Tabs>

This selects datasets that declare the requested modality. Check their files
before starting an analysis; declaring a modality does not mean its files have
already been uploaded.

## Bring files into a dataset

A script can upload a locally produced file directly to a dataset. For example,
upload a CSV of measurements after preparing it in your analysis environment.
Every file declares its data product and the sensor modality that captured it;
use `none` for files without a sensor:

<Tabs groupId="sdk-language">
<TabItem value="python" label="Python" default>

```python
with PhenoWorksClient() as client:
    uploaded = client.upload_dataset_file(
        dataset_id=42,
        path="measurements.csv",
        data_product="csv",
        modality="none",
        metadata={"plot_id": "P001"},
        description="Field measurements prepared in Python",
    )
    print(uploaded)
```

</TabItem>
<TabItem value="r" label="R">

```r
uploaded <- client$upload_dataset_file(
  dataset_id = 42,
  path = "measurements.csv",
  data_product = "csv",
  modality = "none",
  metadata = list(plot_id = "P001"),
  description = "Field measurements prepared in R"
)
print(uploaded)
```

</TabItem>
</Tabs>

These methods register, transfer, and finalize a dataset file using the upload
backend selected by the server. The file must exist locally, and you must own
the dataset's project. A `plot_id` in the metadata groups the file with the
plot's other files when a pipeline runs. To import many plot files at once, use
`client.files.import_zip(42, "collection.zip")` (`client$files$import_zip` in R)
with a ZIP of per-plot JSON sidecars; see
[Importing Data](/docs/tutorials/import-data) for every upload method.

## Run a pipeline and retrieve its outputs

Suppose you have a dataset ready for processing and a valid LgoPy pipeline
definition saved as `pipeline.json`. The required analysis modules must be
installed for your account, and the pipeline must match the dataset's inputs.
The [workflow tutorial](/docs/tutorials/run-workflow) covers preparing and
running an analysis in PhenoWorks.

Replace dataset ID `42` below with your dataset. Each example submits a new
run—choose the language you want to use.

<Tabs groupId="sdk-language">
<TabItem value="python" label="Python" default>

```python
import json
from pathlib import Path

from phenoworks_sdk import PhenoWorksClient

with PhenoWorksClient() as client:
    definition = json.loads(Path("pipeline.json").read_text(encoding="utf-8"))
    run = client.run_pipeline(dataset_id=42, json_pipeline=definition)
    print("Pipeline run:", run.id)

    run.wait(timeout=3600)

    for artifact in run.artifacts():
        if artifact["status"] == "ready":
            destination = Path("results") / f"artifact-{artifact['id']}"
            client.artifacts.download(artifact["id"], destination)
            print("Saved:", destination)
```

</TabItem>
<TabItem value="r" label="R">

```r
definition <- paste(readLines("pipeline.json", warn = FALSE), collapse = "\n")
run <- client$run_pipeline(dataset_id = 42, json_pipeline = definition)
print(run$id)

run$wait(timeout = 3600)

for (artifact in run$artifacts()) {
  if (identical(artifact$status, "ready")) {
    destination <- file.path("results", paste0("artifact-", artifact$id))
    client$artifacts$download(artifact$id, destination)
    message("Saved: ", destination)
  }
}
```

</TabItem>
</Tabs>

These examples save each ready artifact under its ID. Inspect its format and
metadata to choose the appropriate reader for your next step: a CSV reader for
a table, a raster library for an image, or a point-cloud tool for LiDAR data.
Downloads stream to disk and protect existing files from accidental overwrites.

Save the run ID alongside your analysis notes; it is the same number shown on
the **Jobs** page. You can reconnect later with `client.pipeline_run(123)` in
Python or `client$pipeline_run(run_id = 123)` in R. Reconnecting retrieves an
existing run without submitting another one. A wait timeout stops polling; it
does not cancel the run on the server.

To send blocks only part of each plot, pass `data_products=["orthomosaic"]` or
`modalities=["multispectral"]` to `run_pipeline`.

:::note[Updated October 2026]

Pipeline runs share one ID with their operation, so the examples use `run.id`
(`run$id` in R) instead of separate pipeline and operation IDs. SDK releases
from before this change used `run.pipeline_id` and `run.operation_id`.

:::

## Prefer the terminal?

With the Python CLI extra installed and your connection variables configured,
you can inspect your account or launch a pipeline from the shell:

```bash
phenoworks auth me
phenoworks datasets filter-by-modality thermal --param project_id=7
phenoworks pipeline-runs run --dataset-id 42 --file pipeline.json --wait
```

Run `phenoworks --help` to explore the available commands.

## Start with one dataset

Try listing your projects, choosing a dataset, and bringing one result into
your existing analysis. From there, the same methods can become part of a
notebook, a field-trial report, or a script that processes multiple datasets.

Keep the dataset IDs, pipeline definition, SDK version, and run IDs with your
research code so you can trace how results were produced. The SDKs provide the
connection between PhenoWorks and your analysis environment; your scripts
record the choices that make that connection useful for your research.

Explore the [PhenoWorks documentation](/docs), install the
[Python SDK from PyPI](https://pypi.org/project/phenoworks-sdk/), or try the
[R source package](/downloads/phenoworks_0.1.1.tar.gz).
