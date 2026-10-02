---
slug: building-custom-lgopy-blocks
title: Building Reusable LgoPy Analytical Blocks for PhenoWorks
authors: [haruiz]
tags: [documentation, development]
---

An image-processing script works well on your first dataset. Months later,
a new field campaign brings another batch of images, and you need to repeat
the analysis. Which version of the script did you use? What settings produced
those outputs? Could a colleague reproduce the same steps from the files you
shared?

Reproducible data processing depends on preserving those details alongside the
method. LgoPy blocks help by packaging a transformation with declared inputs,
configurable parameters, and versioned code. In this tutorial, we will use a
simple RGB-to-HSV conversion to show how data reaches a block from each upload
method, how a block declares the sensors and data products it reads, and how to
save derived outputs that can be filtered and reused across datasets in
PhenoWorks.

{/* truncate */}

:::info[Updated October 2026]

This post follows the current PhenoWorks data model: files are grouped by data
product, blocks declare `categories` and `supported_inputs`, and artifacts carry
filterable metadata. The same guide is kept up to date in the docs as
[Build Custom LgoPy Blocks](/docs/tutorials/build-custom-lgopy-blocks).

:::

## What is LgoPy?

[LgoPy](https://github.com/OpenSciML/lgopy) is a Python library for building
multimodal data science pipelines. It lets researchers package Python methods
as blocks that can be installed, inspected, and combined in PhenoWorks.

Phenotyping studies often bring together field observations, images, sensor
readings, and experimental metadata. Each may need a different processing
method. A LgoPy block gives that method a declared input and output, along with
its dependencies and documentation.

The idea is similar to building with Lego pieces. One block calculates a
vegetation index; another summarizes measurements for each plot. When their
inputs and outputs are compatible, the blocks can form a pipeline that a team
can reuse across datasets.

## How data reaches a block

A block never reads the database. PhenoWorks loads a dataset's files, groups
them into **dataset items**, and passes each item to the block. How you upload
the data decides how those items look, so it helps to know the routes before
writing code.

### Every file carries two labels

Each dataset file is classified on two axes when it is uploaded:

| Label | Meaning | Examples |
| --- | --- | --- |
| `data_product` | What the file is. It decides the accepted extensions, the viewer, and which blocks apply. | `image`, `orthomosaic`, `point_cloud`, `csv`, `document` |
| `modality` | Which sensor captured it. Use `none` for files without a sensor. | `rgb`, `thermal`, `multispectral`, `hyperspectral`, `lidar`, `gpr` |

An optional `processing_method` (`photogrammetry`, `registration`, `slam`,
`direct`) records how a derived product was made. A point cloud stays a
`point_cloud` whether it comes from a LiDAR scan (`lidar`) or from drone photos
(`rgb` with `photogrammetry`). Administrators manage the available values under
**Data types**.

### Three ways to upload

All three are available in the **Editor** (open a dataset's menu in the data
tree and choose **Upload files**) and in the **Upload** step of the guided
setup on **Home**. [Importing Data](/docs/tutorials/import-data) walks through each one.

| Upload type | Use it for | What the block receives |
| --- | --- | --- |
| **Single file** | One file that covers the whole field or study, such as an orthomosaic, a point cloud, a CSV of measurements, or a document. | One item per file, with no plot, unless you add a `plot_id` to the file's metadata. |
| **ZIP import** | Files already split by plot, such as RGB, NIR, and thermal captures from a ground robot or phenotyping platform. A JSON sidecar lists each plot's files. | One item per `plot_id`, holding every file the sidecars assign to that plot. |
| **Plot boundaries import** | One field-wide orthomosaic (GeoTIFF) or point cloud (LAS/LAZ) plus plot polygons (a zipped shapefile or a GeoPackage). | One item per plot polygon, holding the clipped raster or point cloud. PhenoWorks creates the plot and survey records, so `plot_id` is an integer plot ID. |

The same uploads are available outside the browser: the Python SDK
(`client.upload_dataset_file(...)` and `client.files.import_zip(...)`), the
`phenoworks` CLI (`phenoworks uploads dataset ...`), and the R client
(`client$upload_dataset_file(...)` and `client$files$import_zip(...)`).

### From files to dataset items

Pipeline loading groups files by the `plot_id` in their metadata (or
`plot_key`). For a ZIP import, a sidecar like this one gives three files the
same plot:

```json
{
  "plot_id": "9035-07",
  "date_taken": "2026-04-14T12:28:07-05:00",
  "treatment": "dry",
  "files": [
    {"path": "R11_C4_9035-07_RGB_Capture.png", "data_product": "image", "modality": "rgb"},
    {"path": "R11_C4_9035-07_Thermal_RawData.csv", "data_product": "csv", "modality": "thermal"},
    {"path": "R11_C4_9035-07_NIR_Capture.png", "data_product": "image", "modality": "multispectral", "bands": ["nir"]}
  ]
}
```

The block then receives one item for plot `9035-07`, with the files grouped by
data product: two records under `files["image"]` (RGB and NIR) and one under
`files["csv"]` (thermal). Extra keys such as `treatment` travel with every file
as metadata. Files without a plot label each become their own item with
`plot_id` set to `None`, so a block must handle both cases.

## Install LgoPy and the example dependencies

You need Python 3.10 or newer and basic familiarity with Python. Create a separate
folder and virtual environment; you do not need to clone PhenoWorks or run its
backend to develop and test this block.

```bash
mkdir my-blocks
cd my-blocks
python -m venv .venv
source .venv/bin/activate
pip install "lgopy @ git+https://github.com/OpenSciML/lgopy.git"
pip install Pillow matplotlib
```

On Windows PowerShell, activate the environment with `.venv\Scripts\Activate.ps1`.

This tutorial uses `BlockContext`, store attributes, and the `categories` and
`supported_inputs` manifest fields. They are on LgoPy's main branch and are not
yet in the 2.0.0 release on PyPI, which is why the command above installs from
GitHub. Once a newer release is published, `pip install --upgrade lgopy` works
too.

| Package | Purpose |
| --- | --- |
| `lgopy` | Provides `Block`, `BlockContext`, local artifact and metadata stores, and block packaging. |
| `Pillow` | Opens RGB images, converts color channels, and encodes the output JPEG. Its Python import name is `PIL`. |
| `matplotlib` | Displays the original image and HSV visualization in the local demo. |

Pip installs LgoPy's declared dependencies automatically. The other imports used
below (`io`, `typing`, `logging`, `pathlib`, and `tempfile`) are part of Python's
standard library. The test is a plain Python script, so `pytest` is not required.

Check that your LgoPy installation provides the APIs used below:

```bash
python -c "import inspect; from lgopy.core import BlockContext; from lgopy.core.stores import InMemoryArtifactStore; assert 'attributes' in inspect.signature(InMemoryArtifactStore.save).parameters, 'Install LgoPy from the main branch'"
```

After validating your block, record the working environment with
`pip freeze > requirements.lock.txt` so a colleague can install the same versions
using `pip install -r requirements.lock.txt`.

## Example: turn RGB images into HSV color mode

Our example, which you will save as `image_2_hsv.py`, reads the RGB images in a
dataset item and converts them to HSV: hue, saturation, and value. It saves each
result as a PhenoWorks artifact, a derived file associated with the pipeline run.

The output is a JPEG visualization with H, S, and V mapped to the RGB channels,
rather than a lossless HSV data file.

## Create the block

Create a file named `image_2_hsv.py` in your project folder and copy the
following code into it:

```python showLineNumbers
from io import BytesIO
from typing import Annotated
import logging

from lgopy.core import Block, BlockContext
from PIL import Image as PILImage


class Image2HSV(Block):
    """Create visible HSV-channel JPEG artifacts from RGB images.

    Args:
        jpeg_quality: JPEG encoding quality for HSV visualizations.
    """

    name = "image_2_hsv"
    display_name = "Image to HSV"
    description = (
        "Convert RGB images to HSV artifacts. "
        "Input: RGB images from plots or individual files (data product image, modality rgb)."
    )
    categories = ["Image Analysis"]
    authors = ["PhenoWorks Team", "haruiz"]
    tags = ["phenoworks", "rgb", "image-processing"]
    version = "0.1.0"
    extras = {
        "supported_inputs": ["rgb:image"],
        "transform_scope": "dataset_item",
        "batch_independent": True,
    }
    logger = logging.getLogger(__name__)

    def __init__(
        self,
        jpeg_quality: Annotated[int, "JPEG quality for saved HSV artifacts"] = 95,
    ) -> None:
        """Configure the block.

        Args:
            jpeg_quality: JPEG encoding quality for HSV visualizations.
        """
        super().__init__()
        self._jpeg_quality: int = jpeg_quality

    def call(self, context: BlockContext) -> dict:
        """Convert RGB images into HSV-channel visualization artifacts.

        Args:
            context: Original input containing one dataset item (a plot's
                files, or one file without a plot) and named outputs from
                completed steps.

        Returns:
            Dictionary with conversion status and processed image count.
        """
        dataset_item = context.input
        plot_id = dataset_item.get("plot_id")
        rgb_images = [
            record for record in dataset_item["files"].get("image", [])
            if record.get("modality") == "rgb"
        ]

        for record in rgb_images:
            self.logger.info(f"Processing plot {plot_id} with RGB image {record['file_uri']}")
            with PILImage.open(record["file_uri"]) as rgb_image:
                hsv_image = rgb_image.convert("RGB").convert("HSV")
            # Store a visible HSV-channel visualization as JPEG.
            hsv_visual = PILImage.merge("RGB", hsv_image.split())
            buffer = BytesIO()
            hsv_visual.save(buffer, format="JPEG", quality=self._jpeg_quality)

            # Files without a plot are separate items; name their outputs after the file.
            key = (
                f"plot_{plot_id}_hsv_{record['id']}.jpg"
                if plot_id is not None
                else f"file_{record['id']}_hsv.jpg"
            )
            survey = record.get("survey") or {}
            self.artifacts.save(
                key,
                data=buffer.getvalue(),
                attributes={
                    "artifact_type": "plot_hsv_image",
                    "associations": {
                        "plot_id": plot_id if isinstance(plot_id, int) else None,
                    },
                    "metadata": {
                        "plot_label": None if plot_id is None else str(plot_id),
                        "source_file_id": record["id"],
                        "survey": survey.get("name") or record.get("survey_key"),
                    },
                },
            )
        return {"status": "success", "plot_id": plot_id, "num_rgb_images": len(rgb_images)}


if __name__ == "__main__":
    # Build the package directory and ZIP archive.
    Image2HSV.build(output_dir="image-2-hsv-block", format="zip")

    # Test the block and display the results.
    # Matplotlib is only needed for this demo, so it is imported here.
    # The block itself does not use it, so the builder leaves it out
    # of requirements.txt.
    from pathlib import Path
    import matplotlib.pyplot as plt
    from lgopy.core.stores import InMemoryArtifactStore, InMemoryMetadataStore

    block = Image2HSV()
    block.artifacts = InMemoryArtifactStore()
    block.metadata = InMemoryMetadataStore()

    image_path = Path(__file__).resolve().parent / "test_images" / "img.png"
    result = block.call(BlockContext(input={
        "plot_id": 101,
        "plot": {"id": 101, "name": "Plot 101"},
        "files": {
            "image": [{"id": 1, "modality": "rgb", "data_product": "image",
                       "file_uri": str(image_path)}],
        },
    }))
    print("Result:", result)
    print("Artifacts:", list(block.artifacts.all()))

    figure, axes = plt.subplots(1, 2, figsize=(12, 6))
    with PILImage.open(image_path) as image:
        axes[0].imshow(image.convert("RGB"))
    axes[0].set_title("Original RGB image")

    # This JPEG maps H, S, V to R, G, B for visualization; it is not RGB color.
    with PILImage.open(block.artifacts.as_bytes_io("plot_101_hsv_1.jpg")) as image:
        axes[1].imshow(image)
    axes[1].set_title("HSV channels (R=Hue, G=Saturation, B=Value)")
    for axis in axes:
        axis.axis("off")
    figure.tight_layout()
    plt.show()
```

## Describe the block

`Image2HSV` inherits from LgoPy's `Block` class. The class attributes describe
it in the catalog. The **Modules** page, the pipeline picker, and the Agent's
module search all read them from the package's `manifest.json`, so they decide
whether researchers can find the block and whether PhenoWorks offers it for a
dataset.

| Attribute | Example | Purpose |
| --- | --- | --- |
| `name` | `"image_2_hsv"` | Stable catalog identifier. Pipeline steps and installations refer to it. |
| `display_name` | `"Image to HSV"` | Label shown in the catalog and the pipeline picker. |
| `description` | `"Convert RGB images..."` | One or two sentences on what the block does. State the inputs it expects; the Agent reads this text to decide whether the block fits a dataset. |
| `categories` | `["Image Analysis"]` | One or more catalog groups, used by the Modules page filters and the pipeline picker. It replaces the single `category` string; LgoPy still reads `category` from older blocks. |
| `authors` | `["PhenoWorks Team", "haruiz"]` | Credit shown with the module. |
| `tags` | `["rgb", "image-processing"]` | Search keywords. |
| `version` | `"0.1.0"` | Package version. Publish changed code under a new version so earlier runs keep a stable implementation. |
| `extras` | see below | Runtime properties PhenoWorks reads when it plans and executes a pipeline. |

### Runtime properties in `extras`

`extras` is a dictionary of properties that tell PhenoWorks which data the block
reads and how to call it:

| Key | Values | What PhenoWorks does with it |
| --- | --- | --- |
| `supported_inputs` | A list of `"modality:data_product"` pairs, such as `["rgb:image"]` or `["multispectral:orthomosaic", "multispectral:image"]`. Use `*` for any sensor, as in `"*:point_cloud"`. An empty list means the block reads no files. | Written to the manifest. The Modules page filters by modality and data product with it, the Home guide suggests blocks whose pairs match the uploaded files, and the Agent compares it with a dataset's contents. At run time, an item-level block is only called for items that contain at least one matching file. |
| `transform_scope` | `"dataset_item"` (the default) or `"dataset"` | `dataset_item` calls the block once per item, in parallel. `dataset` calls it once with every item. |
| `batch_independent` | `True` | Declares that processing items in separate batches gives the same result. Required by every block in a [batched run](/docs/tutorials/batched-item-pipelines). |

Each `supported_inputs` pair matches files on both labels at once.
`"rgb:image"` accepts RGB images, not RGB orthomosaics or thermal images. List
every combination your code can read. The pairs are a filter, not a guarantee:
the code still selects the records it needs, as the next sections show.

The NDVI block in the catalog, for example, declares
`["multispectral:orthomosaic", "multispectral:image"]` because it reads both
field-wide orthomosaics and per-plot multispectral captures. A point-cloud
feature block declares `["*:point_cloud"]` because LiDAR and photogrammetric
clouds share the same format.

### Settings

There is one configurable setting: `jpeg_quality`, which defaults to `95`. Its
`Annotated[...]` declaration supplies a type and description for LgoPy's
parameter schema, which PhenoWorks shows in the **Parameters** step of a new
pipeline run. After initializing the base class with `super().__init__()`, the
constructor stores the chosen quality in `self._jpeg_quality`.

Keep parameter descriptions and defaults in step with the implementation. They
help other researchers configure the block correctly.

## Understand the input

PhenoWorks passes data to `call(self, context: BlockContext)` through
`context.input`. The input depends on the block's `transform_scope`:

| Scope | Data passed to the block |
| --- | --- |
| `dataset_item` | One item: a plot's files, or a single file without a plot. Used by `Image2HSV`. |
| `dataset` | Dataset information and the list of every item. |

### Dataset-item input

An item groups its files by data product. Every file record repeats its own
`modality`, so a block narrows a product to one sensor itself. This example
shows the main fields; PhenoWorks also includes the project, study, and dataset
IDs, and acquisition fields such as `timestamp`, `gps_lat`, and `width`.

```python
from lgopy.core import BlockContext

dataset_item = {
    "dataset_id": 1,
    "plot_id": 101,  # None for a file without a plot
    "plot": {"id": 101, "name": "Plot 101", "plot_code": "A12"},
    "data_products": ["image"],
    "modalities": ["rgb"],
    "files": {
        "image": [
            {
                "id": 1,
                "data_product": "image",
                "modality": "rgb",
                "processing_method": None,
                "bands": [],
                "sensor_name": "Sony A7R",
                "survey": {"id": 3, "name": "June 10", "collected_on": "2026-06-10"},
                "survey_key": "June 10",
                "metadata": {"plot_id": 101, "treatment": "dry"},
                "relative_path": "101/IMG_0001.jpg",
                "file_uri": "/absolute/path/to/image.jpg",
            }
        ],
    },
}

item_context = BlockContext(input=dataset_item)
```

Key fields of a file record:

| Field | Meaning |
| --- | --- |
| `file_uri` | A local path to read. For cloud storage, PhenoWorks downloads a temporary copy for the duration of the call. |
| `data_product`, `modality`, `processing_method` | The file's classification from upload. |
| `bands` | Named spectral bands, such as `["nir"]` for a single-band NIR frame or `["red", "green", "blue", "rededge", "nir"]` for a multiband raster. Empty when the upload named none. |
| `survey`, `survey_key` | The data collection the file belongs to. A plot boundaries import records the survey for each plot file, so `survey` holds its ID, name, and date. For other uploads, `survey_key` repeats the file's `survey_id` metadata label, and `survey` is filled in when that label is the ID of one of the dataset's surveys. Compare surveys to follow change over a season. |
| `metadata` | Every metadata key from the upload, including sidecar fields such as `treatment`. |

For an item without a plot, `plot_id` and `plot` are `None`. `Image2HSV` names
those outputs after the file instead, so its artifact keys stay unique.

Within an item, records of the same product are sorted by `timestamp`. A plot
surveyed twice therefore delivers both captures in date order; use `survey` to
pick one, or process them all and record the survey with each output.

### Select the files you need

`supported_inputs` only guarantees that an item holds at least one matching
file. The item can hold other files too: the plot from the sidecar example above
arrives with an RGB image, a NIR image, and a thermal CSV. Filter the records
inside `call(...)`:

```python
files = dataset_item["files"]
rgb_images = [r for r in files.get("image", []) if r["modality"] == "rgb"]
nir_frames = [r for r in files.get("image", []) if "nir" in r["bands"]]
thermal_tables = [r for r in files.get("csv", []) if r["modality"] == "thermal"]
june_images = [r for r in rgb_images if (r.get("survey") or {}).get("name") == "June 10"]
```

When the method cannot run without a file, such as NDVI without a near-infrared
band, raise a `ValueError` that names the plot and the missing input. The error
appears in the run's output log.

### Dataset input

For a block declared with `"transform_scope": "dataset"`, use this outer
structure. `dataset_items` contains items like the one above:

```python
dataset = {
    "dataset_id": 1,
    "dataset": {"id": 1, "name": "Example trial"},
    "modalities": ["rgb"],
    "data_products": ["image"],
    "dataset_items": [dataset_item],
}

dataset_context = BlockContext(input=dataset)
```

Dataset-scope blocks receive every item, regardless of `supported_inputs`. Use
this scope for methods that need the whole dataset at once, such as fitting a
model across plots or normalizing with dataset-wide statistics.

`context.outputs` holds results from earlier pipeline steps, keyed by step name.
It is empty in a local test. If your block needs an earlier result, supply it
with `BlockContext(input=dataset_item, outputs={"previous_step": previous_result})`.
Item-level results are combined by the runtime, so do not assume a named output
is one item's dictionary.

## Follow the processing step

For each RGB image, `call(...)`:

1. Opens the image with Pillow.
2. Converts it to HSV and splits the three channels.
3. Combines those channels into a viewable RGB image.
4. Encodes the visualization as a JPEG using `self._jpeg_quality`.
5. Saves the bytes through `self.artifacts.save(..., attributes=...)`.

The artifact key `plot_101_hsv_1.jpg` records both the plot and the source file
ID. The original image stays intact.

After processing, the block returns `status`, `plot_id`, and `num_rgb_images`.
An item with no RGB images produces a successful result with a count of zero.
Any exception propagates to the runner, which marks the run as failed and
records the error in its log.

## Describe the outputs

The `attributes` dictionary decides how an artifact appears in the
[pipeline run's artifacts table](/docs/tutorials/view-export-results):

| Attribute | Rules | Effect |
| --- | --- | --- |
| `artifact_type` | Nonempty string; defaults to `lgopy_block_artifact`. | Shown as the artifact's type, and used to filter outputs. |
| `associations` | Only `plot_id` is accepted, as a positive integer or `None`. The run, dataset, and project are filled in by PhenoWorks. | Links the artifact to a plot record. |
| `metadata` | Any JSON object. It cannot use the reserved keys `pipeline_run_id`, `source`, `key`, or `attributes`. | Each value becomes a column you can filter and group by in the artifacts table. |
| `format` | Optional; inferred from the key's extension. | Recorded file format. |

Plot labels from a sidecar, such as `"9035-07"`, are strings rather than plot
record IDs; only a plot boundaries import creates plot records. `Image2HSV`
therefore associates only integer IDs and keeps every label in
`metadata.plot_label`. Recording `survey` and `source_file_id` the same way lets
researchers group the outputs by plot or survey after the run.

## Check the block locally

You can test the block without a database or a running PhenoWorks server. LgoPy
provides in-memory artifact and metadata stores that keep the content and
attributes supplied by the block.

The following test builds two items, one plot holding an RGB image and a thermal
table and one RGB image without a plot, and checks the generated JPEGs. Save it
as `test_image_2_hsv.py` alongside the block and run
`python test_image_2_hsv.py`:

```python
from pathlib import Path
from tempfile import TemporaryDirectory

from lgopy.core import BlockContext
from lgopy.core.stores import InMemoryArtifactStore, InMemoryMetadataStore
from PIL import Image as PILImage

from image_2_hsv import Image2HSV


def run(item):
    """Run one dataset item through a fresh block and return its result and artifacts."""
    block = Image2HSV()
    block.artifacts = InMemoryArtifactStore()
    block.metadata = InMemoryMetadataStore()
    return block.call(BlockContext(input=item)), block.artifacts


with TemporaryDirectory() as directory:
    rgb_path = Path(directory) / "rgb.jpg"
    PILImage.new("RGB", (32, 32), color=(80, 150, 40)).save(rgb_path)
    thermal_path = Path(directory) / "thermal.csv"
    thermal_path.write_text("temperature_c\n21.5\n")
    survey = {"id": 3, "name": "June 10", "collected_on": "2026-06-10"}

    # A plot from a ZIP import: an RGB image and a thermal table.
    plot_item = {
        "dataset_id": 1,
        "plot_id": "P001",
        "plot": {"id": "P001", "name": "P001", "plot_code": "P001"},
        "files": {
            "image": [{"id": 1, "modality": "rgb", "data_product": "image",
                       "bands": [], "survey": survey, "file_uri": str(rgb_path)}],
            "csv": [{"id": 2, "modality": "thermal", "data_product": "csv",
                     "bands": [], "survey": survey, "file_uri": str(thermal_path)}],
        },
    }
    result, artifacts = run(plot_item)
    print(result)
    assert result == {"status": "success", "plot_id": "P001", "num_rgb_images": 1}

    with PILImage.open(artifacts.as_bytes_io("plot_P001_hsv_1.jpg")) as image:
        assert image.format == "JPEG"
        assert image.size == (32, 32)

    attributes = artifacts.get_attributes("plot_P001_hsv_1.jpg")
    assert attributes["artifact_type"] == "plot_hsv_image"
    assert attributes["associations"] == {"plot_id": None}
    assert attributes["metadata"] == {
        "plot_label": "P001", "source_file_id": 1, "survey": "June 10",
    }

    # A single-file upload without a plot label.
    plotless_item = {
        "dataset_id": 1,
        "plot_id": None,
        "plot": None,
        "files": {"image": [{"id": 7, "modality": "rgb", "data_product": "image",
                             "bands": [], "survey": None, "file_uri": str(rgb_path)}]},
    }
    result, artifacts = run(plotless_item)
    print(result)
    assert list(artifacts.all()) == ["file_7_hsv.jpg"]

print("All checks passed")
```

PhenoWorks injects its own stores during a pipeline run: they write files,
queue their database records, and commit the records when the run succeeds.
Failed runs clean up their unregistered outputs. The local stores keep their
contents in memory, and the temporary input image is removed after the test.

## Build and install the block

To run the full entry point, place an RGB image at `test_images/img.png`
relative to `image_2_hsv.py`, then run:

```bash
python image_2_hsv.py
```

The `__main__` section calls
`Image2HSV.build(output_dir="image-2-hsv-block", format="zip")`, creating a
package directory and a ZIP archive alongside it. The builder can replace an
existing output directory, so keep your source files elsewhere. The demo then
processes the sample as plot `101` and displays the original image beside
`plot_101_hsv_1.jpg`.

To build without running the demo or requiring a sample image, use:

```bash
python -c 'from image_2_hsv import Image2HSV; Image2HSV.build(output_dir="image-2-hsv-block", format="zip")'
```

Before uploading, open the generated `manifest.json` and check:

- `categories` is `["Image Analysis"]` and `supported_inputs` is `["rgb:image"]`.
  If either is missing, the installed LgoPy predates these fields; reinstall it
  from the main branch and rebuild.
- `requirements` (and `requirements.txt`) include compatible LgoPy and Pillow
  versions. Matplotlib is imported only inside `__main__`, so the builder leaves
  it out. Use `pip show lgopy Pillow` to check the versions you tested.

Neither Python's standard library nor the PhenoWorks backend belongs in the
block's requirements.

Publishing a new analysis module requires an administrator account.
Administrators open **Modules**, select **Publish module**, upload the ZIP, and
choose whether to keep its source private. The Python SDK CLI does the same with
`phenoworks analysis-blocks install ./image-2-hsv-block.zip`.

If you are not an administrator, share your block's ZIP file with us on
[Discord](https://discord.gg/6qMb62XSH). The PhenoWorks team will evaluate the
module, provide feedback, and work with you to refine it. Once we have completed
that review, incorporated any needed changes, and thoroughly tested the module,
we will install it and make it available to all users.

You retain ownership of your methods and credit for your work. PhenoWorks
respects contributors' intellectual property; sharing a block does not transfer
ownership of your methods to PhenoWorks. You can also include a `CITATION.cff`
file with your package to specify how others should cite your contribution, as
shown below.

PhenoWorks also supports private publication for modules whose source code must
remain undisclosed. Users and agents can still run these modules, but their code
is not available for inspection. An agent therefore cannot explain a private
module's implementation; any explanation must rely on the documentation the
contributor provides.

Once the module is published, each researcher installs it from **Modules** (see
[Manage LgoPy Modules](/docs/tutorials/manage-modules)). The **Set up an analysis** guide on
**Home** offers it whenever the uploaded data includes RGB images, and the
Editor's **Run Analysis** wizard lists it with the other installed modules.

## Reuse the pattern for feature extraction

The same structure supports a vegetation-index calculation, a canopy-cover
measurement, or a summary of image-channel statistics. The processing method
changes, but the block still declares its inputs, selects the records it needs,
saves its outputs, and returns a result that other code can use.

Let the next research task guide the output format. Images support visual
inspection; measurements and tables support further analysis. A block that
returns a pandas `DataFrame`, with one row per plot or file, produces a results
table that PhenoWorks combines across items and saves with the run.

## Process large datasets in batches

This example declares independent item-level execution:

```python
extras = {"supported_inputs": ["rgb:image"], "transform_scope": "dataset_item", "batch_independent": True}
```

For a pipeline whose every block makes this declaration, include
`"batch_size": 32` in the run request's `parameters` object. PhenoWorks fetches
bounded pages of items and persists each batch's artifacts, metadata, and
results. Files are written during processing; database records remain pending
until the whole run succeeds. Failed attempts have their output folders cleaned
up, with persisted cleanup tracking for worker-crash or storage-failure recovery.

Do not declare batch independence for methods that fit across the dataset or
need another batch's state. Use item-specific output keys, as this example does.
Results remain separate per batch, and retries currently restart from the first
batch. See [batched pipeline execution](/docs/tutorials/batched-item-pipelines) for the full
contract.

## Package existing documentation and citations

Pass optional author-maintained files to the build method:

```python
Image2HSV.build(
    output_dir="image-2-hsv-block",
    format="zip",
    readme_file="README.md",
    citation_file="CITATION.cff",
)
```

Both files are included in directory and ZIP packages when supplied. Omitting
`readme_file` keeps the generated README; omitting `citation_file` requires no
citation. Supplied paths must be readable UTF-8 files. The builder checks
citation YAML and required CFF metadata (not the full optional CFF schema). See
the [CFF schema guide](https://github.com/citation-file-format/citation-file-format/blob/main/schema-guide.md)
for the complete format. PhenoWorks preserves both files during publication and
shows them in the module's details whether or not the source is private.
