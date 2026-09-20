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
method. LgoPy blocks help by packaging a transformation with defined inputs,
configurable parameters, and versioned code. In this tutorial, we will use a
simple RGB-to-HSV conversion to show how to read plot images, save derived
visualizations, and build a processing component that can be shared and reused
across datasets in PhenoWorks.

{/* truncate */}

## What is LgoPy?

[LgoPy](https://pypi.org/project/lgopy/) is a Python library for
building multimodal data science pipelines. It lets researchers package Python
methods as blocks that can be installed, inspected, and combined in PhenoWorks.

Phenotyping studies often bring together field observations, images, sensor
readings, and experimental metadata. Each may need a different processing
method. A LgoPy block gives that method a defined input and output, along with
its dependencies and documentation.

The idea is similar to building with Lego pieces. One block calculates a
vegetation index; another summarizes measurements for each plot. When their
inputs and outputs are compatible, the blocks can form a pipeline that a team
can reuse across datasets.

## Install LgoPy and the example dependencies

You need Python 3.10 or newer and basic familiarity with Python. Create a separate
folder and virtual environment; you do not need to clone PhenoWorks or run its
backend to develop and test this block.

```bash
mkdir my-blocks
cd my-blocks
python -m venv .venv
source .venv/bin/activate
pip install lgopy
pip install Pillow matplotlib
```

On Windows PowerShell, activate the environment with `.venv\Scripts\Activate.ps1`.

| Package | Purpose |
| --- | --- |
| `lgopy` | Provides `Block`, `BlockContext`, local artifact and metadata stores, and block packaging. |
| `Pillow` | Opens RGB images, converts color channels, and encodes the output JPEG. Its Python import name is `PIL`. |
| `matplotlib` | Displays the original image and HSV visualization in the local demo. |

Pip installs LgoPy's declared dependencies automatically. The other imports used
below—`io`, `typing`, `logging`, `pathlib`, and `tempfile`—are part of Python's
standard library and need no separate installation. The test is a plain Python
script, so `pytest` is not required.

You can also record the three direct dependencies in `requirements.txt`:

```text
lgopy
Pillow
matplotlib
```

Install them together with `pip install -r requirements.txt`. After validating
your block, record the working environment with
`pip freeze > requirements.lock.txt` so a colleague can install the same versions
using `pip install -r requirements.lock.txt`.

The examples below require `BlockContext` and the store-attributes API: `save(..., attributes=...)`,
`set(..., attributes=...)`, and `get_attributes(...)`. Check that your installed
LgoPy version provides both before running the examples:

```bash
python -c "import inspect; from lgopy.core import BlockContext; from lgopy.core.stores import InMemoryArtifactStore; assert 'attributes' in inspect.signature(InMemoryArtifactStore.save).parameters, 'Install a LgoPy release with store-attributes support'"
```

If this check fails, the installed release predates the required API. Upgrade
with `pip install --upgrade lgopy` and use a release containing both APIs; the
PhenoWorks runtime must also support context-aware blocks.

## Example: turn RGB images into HSV color mode

Our example, which you will save as `image_2_hsv.py`, reads the RGB images for a
plot and converts them to HSV: hue, saturation, and value. It then saves the
results as a PhenoWorks artifact, a derived file associated with the processing
run.

The output is a JPEG visualization with H, S, and V mapped to the RGB channels,
rather than a lossless HSV data file.

## Create the block

Create a file named `image_2_hsv.py` in your project folder and copy the following
code into it:

```python showLineNumbers
from io import BytesIO
from typing import Annotated

from lgopy.core import Block, BlockContext
from PIL import Image as PILImage
import logging


class Image2HSV(Block):
    """Create visible HSV-channel JPEG artifacts from RGB plot images.

    Args:
        jpeg_quality: JPEG encoding quality for HSV visualizations.
    """

    extras = {"transform_scope": "dataset_item", "batch_independent": True}

    name = "image_2_hsv"
    display_name = "Image to HSV"
    description = "Convert RGB image to HSV artifacts"
    category = "Image Processing"
    authors = ["PhenoWorks", "haruiz"]
    tags = ["phenoworks", "rgb", "image-processing"]
    version = "0.1.0"
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
        """Convert RGB plot images into HSV-channel visualization artifacts.

        Args:
            context: Original input containing one plot sample and named
                outputs from completed steps.

        Returns:
            Dictionary with conversion status and processed asset counts.
        """
        dataset_item = context.input
        try:
            plot_id = dataset_item.get("plot_id")
            rgb_assets = dataset_item["assets"].get("rgb", [])

            for rgb_asset in rgb_assets:
                rgb_image = PILImage.open(rgb_asset["file_uri"])
                self.logger.info(
                    f"Processing plot {plot_id} with RGB asset {rgb_asset['file_uri']}"
                )
                # Store a visible HSV-channel visualization as JPEG.
                hsv_image = rgb_image.convert("HSV")
                hsv_visual = PILImage.merge("RGB", hsv_image.split())

                buffer = BytesIO()
                hsv_visual.save(buffer, format="JPEG", quality=self._jpeg_quality)
                image_bytes = buffer.getvalue()

                self.artifacts.save(
                    f"plot_{plot_id}_hsv_{rgb_asset['id']}.jpg",
                    data=image_bytes,
                    attributes={
                        "artifact_type": "plot_hsv_image",
                        "associations": {
                            "plot_id": plot_id if isinstance(plot_id, int) else None
                        },
                    },
                )
            return {
                "status": "success",
                "plot_id": plot_id,
                "num_rgb_assets": len(rgb_assets),
            }
        except Exception as e:
            self.logger.error(f"Error processing  plot {plot_id}: {e}")
            raise


if __name__ == "__main__":
    # build artifact
    Image2HSV.build(output_dir="image-2-hsv-block", format="zip")

    # Test the block and display the results.
    # Matplotlib is only needed for this test, so we import it here.
    # The block itself does not use it, so the builder leaves it out
    # of requirements.txt.
    from pathlib import Path
    import matplotlib.pyplot as plt
    from lgopy.core.stores import InMemoryArtifactStore, InMemoryMetadataStore

    artifacts = InMemoryArtifactStore()
    metadata = InMemoryMetadataStore()

    block = Image2HSV()
    block.artifacts = artifacts
    block.metadata = metadata

    image_path = Path(__file__).resolve().parent / "test_images" / "img.png"
    result = block.call(
        BlockContext(input={
            "plot_id": 101,
            "plot": {"name": "Plot 101"},
            "assets": {
                "rgb": [{"id": 1, "file_uri": str(image_path)}],
            },
        })
    )
    metadata.set("test.result", result)
    print("Artifacts:", list(artifacts.all()))
    print("Metadata:", metadata.all())

    figure, axes = plt.subplots(1, 2, figsize=(12, 6))
    with PILImage.open(image_path) as image:
        axes[0].imshow(image.convert("RGB"))
    axes[0].set_title("Original RGB image")

    # This JPEG maps H, S, V to R, G, B for visualization; it is not RGB color.
    with PILImage.open(artifacts.as_bytes_io("plot_101_hsv_1.jpg")) as image:
        axes[1].imshow(image)
    axes[1].set_title("HSV channels (R=Hue, G=Saturation, B=Value)")
    for axis in axes:
        axis.axis("off")
    figure.tight_layout()
    plt.show()
```

## Define the method and its settings

`Image2HSV` inherits from LgoPy's `Block` class. The attributes at the top identify
it in the catalog: `image_2_hsv` is its name, **Image to HSV** its display label,
and `0.1.0` its version. The remaining metadata helps researchers find the method
and understand what it does before reading the code.

There is one configurable setting: `jpeg_quality`, which defaults to `95`.
Its `Annotated[...]` declaration supplies a type and description for LgoPy's
schema. After initializing the base class with `super().__init__()`, the
constructor stores the chosen quality in `self._jpeg_quality` for use when
saving the JPEG.

When you adapt the example, keep these parameter descriptions and defaults in
step with the implementation. They help other researchers configure the block
correctly.

## Understand the input

PhenoWorks passes data to `call(self, context: BlockContext)` through
`context.input`. To test a block locally, wrap your sample data in the same way.
The input depends on the block's declared scope:

| Scope | Data passed to the block |
| --- | --- |
| `dataset_item` | One plot and its assets, as used by `Image2HSV`. |
| `dataset` | Dataset information and a list of plot items. |

### Dataset-item input

This example shows the item structure, with only the plot and asset metadata
needed for this test. PhenoWorks includes additional metadata in those records.
Replace `file_uri` with the path to an RGB image on your computer.

```python
from lgopy.core import BlockContext

dataset_item = {
    "dataset_id": 1,
    "plot_id": 101,
    "plot": {"id": 101, "name": "Plot 101"},
    "modalities": ["rgb"],
    "assets": {
        "rgb": [
            {"id": 1, "file_uri": "/absolute/path/to/image.jpg"}
        ],
    },
}

item_context = BlockContext(input=dataset_item)
```

For `Image2HSV`, call `block.call(item_context)` after setting up the block and
its stores, as shown in **Check the block locally** below.

### Dataset input

For a block declared with `extras = {"transform_scope": "dataset"}`, use this
outer structure. The `dataset_items` list contains items like the one above;
the dataset metadata is shortened here for readability.

```python
dataset = {
    "dataset_id": 1,
    "dataset": {"id": 1, "name": "Example trial"},
    "modalities": ["rgb"],
    "dataset_items": [dataset_item],
}

dataset_context = BlockContext(input=dataset)
```

Pass `dataset_context` to a dataset-level block's `call(...)` method.
`Image2HSV` expects `item_context` because it processes one plot at a time.
When testing locally, you choose which input to pass; PhenoWorks does this for
you when running a dataset pipeline.

`context.outputs` holds results from earlier pipeline steps. It is empty by
default in a local test. If your block needs an earlier result, supply it with
`BlockContext(input=dataset_item, outputs={"previous_step": previous_result})`.

## Follow the processing step

For each RGB asset, `call(...)`:

1. Opens the image with Pillow.
2. Converts it to HSV and splits the three channels.
3. Combines those channels into a viewable RGB image.
4. Encodes the visualization as a JPEG using `self._jpeg_quality`.
5. Saves the bytes through `self.artifacts.save(..., attributes=...)`.

A file named `plot_101_hsv_1.jpg` records both the plot and source asset identifiers.
The artifact has the type `plot_hsv_image`; when the plot identifier is an integer,
the block also passes it to the artifact store. The original image stays intact.

After processing, the block returns `status`, `plot_id`, and `num_rgb_assets`.
An empty RGB list produces a successful result with a count of zero. If processing
fails, the block logs the error and raises it to the caller.

The JPEG is saved through the artifact store, while `call(...)` returns a status
dictionary. PhenoWorks makes completed step results available to later
context-aware blocks through `context.outputs`, using the pipeline step name
(which may differ from the block's catalog name). Item-level results are
aggregated by the runtime, so do not assume a named output is one item's status
dictionary. A later block can still read the original scoped input through
`context.input` and retrieve generated images from the artifact store as needed.

For a direct local call, construct `BlockContext(input=dataset_item)` yourself.
To test a block that consumes earlier results, also pass
`outputs={"previous_step": previous_result}`. Calling `block.call(...)` directly
does not populate pipeline outputs automatically.

## Understand artifact ownership

The example supplies an artifact classification and an explicit plot association:

```python
attributes={
    "artifact_type": "plot_hsv_image",
    "associations": {"plot_id": plot_id},
}
```

PhenoWorks supplies pipeline, project, study, and dataset IDs through its runtime
store. Block authors do not need to pass those IDs when saving an artifact.
For example, `self.artifacts.save("output.jpg", image_bytes)` still creates an
artifact associated with the current pipeline and dataset. Its default
`artifact_type` is `lgopy_block_artifact`, and its format is inferred from the
filename extension (`jpg` here; `bin` when there is no extension).

Plot ownership is currently explicit: omitting `associations.plot_id` leaves the
database `plot_id` empty. It is not inferred from the filename or current input.
Only `plot_id` is accepted in `associations`; the runtime owns the other hierarchy
IDs. Add descriptive fields separately, for example
`"metadata": {"jpeg_quality": self._jpeg_quality}` inside `attributes`.

Locally, LgoPy's in-memory store retains the bytes and attributes for inspection.
Inside PhenoWorks, its store writes the file immediately and prepares a
`PipelineArtifactCreateRecord`. Database persistence then records the hierarchy
IDs, artifact type, file URI, and metadata. The local test never connects to that
database.

## Check the block locally

You can test the block without a database or a running PhenoWorks server.
LgoPy provides in-memory artifact and metadata stores that preserve the content
and JSON-compatible attributes supplied by the block. No custom test adapter is needed.

The following example uses a minimal item fixture, creates a temporary RGB
image, runs the block, and checks the generated JPEG. Save it as `test_image_2_hsv.py` alongside the block and run
`python test_image_2_hsv.py`:

```python
from pathlib import Path
from tempfile import TemporaryDirectory

from lgopy.core import BlockContext
from lgopy.core.stores import InMemoryArtifactStore, InMemoryMetadataStore
from PIL import Image as PILImage

from image_2_hsv import Image2HSV


artifacts = InMemoryArtifactStore()
metadata = InMemoryMetadataStore()

block = Image2HSV()
block.artifacts = artifacts
block.metadata = metadata

with TemporaryDirectory() as directory:
    image_path = Path(directory) / "rgb.jpg"
    PILImage.new("RGB", (32, 32), color=(80, 150, 40)).save(image_path)

    result = block.call(BlockContext(input={
        "plot_id": 101,
        "plot": {"name": "Plot 101"},
        "assets": {
            "rgb": [{"id": 1, "file_uri": str(image_path)}],
        },
    }))

metadata.set("test.result", result, attributes={"purpose": "local smoke test"})
print(result)
print("Artifacts:", list(artifacts.all()))
print("Metadata:", metadata.all())

with PILImage.open(artifacts.as_bytes_io("plot_101_hsv_1.jpg")) as image:
    assert image.format == "JPEG"
    assert image.size == (32, 32)

attributes = artifacts.get_attributes("plot_101_hsv_1.jpg")
assert attributes["artifact_type"] == "plot_hsv_image"
assert attributes["associations"] == {"plot_id": 101}
assert metadata.get_attributes("test.result") == {"purpose": "local smoke test"}
```

The local store retains both JPEG bytes and artifact attributes. PhenoWorks
injects its own store during pipeline execution: it writes files, queues their
database records, and commits output records with successful pipeline completion.
Database rollback does not undo file writes; failed runs clean up unregistered
outputs separately. Both local test stores keep their contents in memory, and
the temporary input image is removed after processing.

`Image2HSV` does not write metadata itself. The example explicitly stores its
result under `test.result` to demonstrate the metadata store. To try a real image,
replace the temporary-image setup with an existing local path.

For this single-image example, a successful call saves the visualization and
returns:

```python
{"status": "success", "plot_id": 101, "num_rgb_assets": 1}
```

## Build and install the block

To run the full entry point, place an RGB image at `test_images/img.png`
relative to `image_2_hsv.py`, then run:

```bash
python image_2_hsv.py
```

The `__main__` section calls
`Image2HSV.build(output_dir="image-2-hsv-block", format="zip")`, creating a
package directory and a ZIP archive alongside it. The builder can replace an
existing output directory, so keep your source files elsewhere.

After building, the script attaches in-memory artifact and metadata stores,
processes the sample as plot `101`, stores the result under `test.result`, and
prints the stored artifacts and metadata. Matplotlib then displays the original
image beside `plot_101_hsv_1.jpg`, with H, S, and V mapped to R, G, and B.

To build without running the demo or requiring a sample image, use:

```bash
python -c 'from image_2_hsv import Image2HSV; Image2HSV.build(output_dir="image-2-hsv-block", format="zip")'
```

Before uploading, inspect the generated package's `requirements.txt` and the
`requirements` list in `manifest.json`. Both must include compatible LgoPy and
Pillow versions. Matplotlib is imported inside `__main__` for testing and
inspecting the results. Because the block class does not use it, the builder
excludes it from the block's requirements. Automatic dependency detection can
miss packages whose import name differs from their distribution name: the
current builder omitted Pillow when checking this example's `PIL` import.

Use `pip show lgopy Pillow` to check the versions you tested. If Pillow is missing,
add its matching `Pillow==...` requirement to both files, then recreate the ZIP
from the corrected package directory. Preserve the package layout and other
manifest fields. Installing Pillow locally does not automatically make it a
declared dependency of the uploaded block. Neither Python's standard library
nor the PhenoWorks backend belongs in this block's requirements.

Install the generated ZIP directly in the PhenoWorks UI through
**Analysis Modules**. Then select a compatible dataset, set `jpeg_quality`,
and run the block in a dataset pipeline.

## Reuse the pattern for feature extraction

The same structure can support a vegetation-index calculation, a canopy-cover
measurement, or a summary of image-channel statistics. The processing method
changes, but the block still reads a defined input, saves its outputs, and
returns a result that other code can use.

Let the next research task guide the output format. Images support visual
inspection; measurements and tables support further analysis. Clear input and
output descriptions make it easier for another researcher to connect your block
to a pipeline and apply the method to a new dataset.

## Process large datasets in batches

This example declares independent item-level execution:

```python
extras = {"transform_scope": "dataset_item", "batch_independent": True}
```

For a pipeline whose every block makes this declaration, include
`"batch_size": 32` in the run request's `parameters` object. PhenoWorks fetches
bounded plot pages and persists each batch's artifacts, metadata, and results.
Files are written during processing; database records remain pending until the
whole run succeeds. Failed attempts have their output folders cleaned up, with
persisted cleanup tracking for worker-crash or storage-failure recovery.

Do not declare batch independence for methods that fit across the dataset or
need another batch's state. Use item-specific output keys, as this example does.
Results remain separate per batch, and retries currently restart from the first
batch. See [batched pipeline execution](/docs/tutorials/batched-item-pipelines) for the full contract.
