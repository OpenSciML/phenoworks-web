# Tutorial: Build Custom LgoPy Blocks

In this tutorial, you will learn how to create a reusable LgoPy analysis block
for PhenoWorks. Using RGB-to-HSV conversion as an example, you will define the
block's inputs and settings, save output artifacts, test it locally, and package
it for installation in the analysis catalog.

To see why this matters, imagine an image-processing script that works well on
your first dataset. Months later, a new field campaign brings another batch of
images, and you need to repeat the analysis. Which version of the script did you
use? What settings produced those outputs? Could a colleague reproduce the same
steps from the files you shared?

LgoPy blocks help preserve the method by packaging versioned code with defined
inputs, configurable parameters, and dependencies. Together with PhenoWorks'
recorded workflows and results, they make it easier to trace an analysis and
repeat it on compatible data.

You will need a PhenoWorks source checkout with its Python environment installed
and basic familiarity with Python. Run the examples from the repository root.

## What is LgoPy?

[LgoPy](https://github.com/OpenSciML/lgopy) is an open-source Python library for
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

## Example: turn RGB images into HSV visualizations

Our example, `blocks/image_analysis/image_2_hsv.py`, reads the RGB images for a
plot and converts them to HSV: hue, saturation, and value. It then saves a
visualization of those channels as a PhenoWorks artifact, a derived file
associated with the processing run.

Hue represents color, saturation its intensity, and value its brightness.
Viewing these channels separately can help you decide how to approach
segmentation or feature extraction.

To make the channels viewable, the block maps H, S, and V to the red, green,
and blue channels of a JPEG. The resulting colors show the HSV channel values,
so they differ from the original photograph. These images are intended for
visual inspection. For numerical measurements that require exact values, work
from the original data or a lossless representation rather than the JPEG.

## Read the complete block

The implementation below comes from `blocks/image_analysis/image_2_hsv.py`:

```python showLineNumbers
from io import BytesIO
from typing import Annotated

from lgopy.core import Block
from PIL import Image as PILImage
import logging

class Image2HSV(Block):
    """Create visible HSV-channel JPEG artifacts from RGB plot images."""

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
        super().__init__()
        self._jpeg_quality = jpeg_quality

    def call(self, dataset_item: dict) -> dict:
        """Convert RGB plot images into HSV-channel visualization artifacts.

        Args:
            dataset_item: Plot dataset item dictionary with plot metadata and assets grouped by modality.

        Returns:
            Dictionary with conversion status and processed asset counts.
        """
        try:
            plot_id = dataset_item.get("plot_id")
            rgb_assets = dataset_item["assets"].get("rgb", [])

            for rgb_asset in rgb_assets:
                rgb_image = PILImage.open(rgb_asset["file_uri"])
                self.logger.info(f"Processing plot {plot_id} with "
                            f"RGB asset {rgb_asset['file_uri']}")
                # Store a visible HSV-channel visualization as JPEG.
                hsv_image = rgb_image.convert("HSV")
                hsv_visual = PILImage.merge("RGB", hsv_image.split())

                buffer = BytesIO()
                hsv_visual.save(buffer, format="JPEG", quality=self._jpeg_quality)
                image_bytes = buffer.getvalue()

                self.artifacts.save_artifact(
                    f"plot_{plot_id}_hsv_{rgb_asset['id']}.jpg",
                    data=image_bytes,
                    artifact_type='plot_hsv_image',
                    plot_id=plot_id if isinstance(plot_id, int) else None
                )
            return {
                "status": "success",
                "plot_id": plot_id,
                "num_rgb_assets": len(rgb_assets),
            }
        except Exception as e:
            self.logger.error(f"Error processing  plot {plot_id}: {e}")
            raise


if __name__ == '__main__':
    Image2HSV.build(output_dir="image-2-hsv-block", format="zip")
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

PhenoWorks passes plot-level blocks a dataset item with a plot identifier and
assets grouped by modality. This block expects RGB assets under `assets["rgb"]`:

```python
{
    "plot_id": 101,
    "assets": {
        "rgb": [
            {"id": 1, "file_uri": "/path/to/plot_101_rgb.jpg"}
        ]
    },
}
```

Each image needs an `id` and a readable `file_uri`. Because this block opens the
file directly with Pillow, use a local image path for the example below. Remote
assets and logical storage keys must first be resolved to files the block can
read.

## Follow the processing step

For each RGB asset, `call(...)`:

1. Opens the image with Pillow.
2. Converts it to HSV and splits the three channels.
3. Combines those channels into a viewable RGB image.
4. Encodes the visualization as a JPEG using `self._jpeg_quality`.
5. Saves the bytes through `self.artifacts.save_artifact(...)`.

A file named `plot_101_hsv_1.jpg` records both the plot and source asset identifiers.
The artifact has the type `plot_hsv_image`; when the plot identifier is an integer,
the block also passes it to the artifact store. The original image stays intact.

After processing, the block returns `status`, `plot_id`, and `num_rgb_assets`.
An empty RGB list produces a successful result with a count of zero. If processing
fails, the block logs the error and raises it to the caller.

This return value matters when you build a pipeline. The JPEG is saved through
the artifact store, while `call(...)` returns a status dictionary. A later step
must accept that dictionary or retrieve the saved image; a step expecting a plot
dataset item cannot use the summary directly.

## Check the block locally

You can test the block without a database or a running PhenoWorks server.
LgoPy provides in-memory artifact and metadata stores. Its artifact store exposes
`save(...)`, while this block calls PhenoWorks' `save_artifact(...)` method, so a
small adapter connects the two.

The following example creates a temporary RGB image, runs the block, and checks
the generated JPEG. Run it from the repository root in the project's Python
environment:

```python
from pathlib import Path
from tempfile import TemporaryDirectory

from lgopy.core.stores import InMemoryArtifactStore, InMemoryMetadataStore
from PIL import Image as PILImage

from blocks.image_analysis.image_2_hsv import Image2HSV


class TestArtifactStore(InMemoryArtifactStore):
    """Store artifact bytes in memory for local block tests."""

    def save_artifact(
        self, key: str, data: bytes, **attributes: object
    ) -> None:
        """Save an artifact without database persistence.

        Args:
            key: Artifact name used to retrieve the stored bytes.
            data: Serialized artifact bytes.
            **attributes: Database-specific attributes ignored by this test store.
        """
        self.save(key, data)


artifacts = TestArtifactStore()
metadata = InMemoryMetadataStore()

block = Image2HSV()
block.artifacts = artifacts
block.metadata = metadata

with TemporaryDirectory() as directory:
    image_path = Path(directory) / "rgb.jpg"
    PILImage.new("RGB", (32, 32), color=(80, 150, 40)).save(image_path)

    result = block.call({
        "plot_id": 101,
        "plot": {"name": "Plot 101"},
        "assets": {
            "rgb": [{"id": 1, "file_uri": str(image_path)}],
        },
    })

metadata.set("test.result", result)
print(result)
print("Artifacts:", list(artifacts.all()))
print("Metadata:", metadata.all())

with PILImage.open(artifacts.as_bytes_io("plot_101_hsv_1.jpg")) as image:
    assert image.format == "JPEG"
    assert image.size == (32, 32)
```

The test adapter retains the JPEG bytes but ignores database-specific attributes
such as `artifact_type` and `plot_id`. PhenoWorks supplies its own adapter during
pipeline execution to record those associations. Both test stores keep their
contents only in memory; the temporary input image is removed after processing.

`Image2HSV` does not write metadata itself. The example explicitly stores its
result under `test.result` to demonstrate the metadata store. To try a real image,
replace the temporary-image setup with an existing local path.

For this single-image example, a successful call saves the visualization and
returns:

```python
{"status": "success", "plot_id": 101, "num_rgb_assets": 1}
```

## Build and install the block

From the repository root, run the example's build entry point:

```bash
uv run python blocks/image_analysis/image_2_hsv.py
```

The `__main__` section calls
`Image2HSV.build(output_dir="image-2-hsv-block", format="zip")`, creating a
package directory and a ZIP archive alongside it. The builder can replace an
existing output directory, so keep your source files elsewhere.

Install the generated ZIP from **Analysis Modules**, or install the package
directory with the CLI:

```bash
phenoworks analysis-blocks install image-2-hsv-block
phenoworks analysis-blocks source image_2_hsv --version 0.1.0
phenoworks analysis-blocks requirements image_2_hsv --version 0.1.0
```

Once installed, inspect the package and its requirements in PhenoWorks. To
produce the visualizations, select a compatible dataset, set `jpeg_quality`,
and run the block in a dataset pipeline. The build command only packages the
method. The current script also runs the local smoke test after building;
processing a dataset starts when you run the installed block in a pipeline.

## Reuse the pattern for feature extraction

The same structure can support a vegetation-index calculation, a canopy-cover
measurement, or a summary of image-channel statistics. The processing method
changes, but the block still reads a defined input, saves its outputs, and
returns a result that other code can use.

Let the next research task guide the output format. Images support visual
inspection; measurements and tables support further analysis. Clear input and
output descriptions make it easier for another researcher to connect your block
to a pipeline and apply the method to a new dataset.
