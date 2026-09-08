---
slug: building-custom-lgopy-blocks
title: Building Reusable LgoPy Analytical Blocks for PhenoLab
authors: [haruiz]
tags: [documentation, development]
---

import TerminalCommands from '@site/src/components/TerminalCommands';

PhenoLab is designed around reusable analytical building blocks. A custom LgoPy
block lets a scientist, developer, precision agriculture specialist, or remote
sensing expert package one method so it can be inspected, shared, and reused
across phenotyping workflows.

{/* truncate */}

## What is LgoPy?

[LgoPy](https://github.com/OpenSciML/lgopy) is an open-source Python library for
building multimodal data science pipelines. In PhenoLab, LgoPy provides the
application layer for turning research code into reusable analysis units that
can be installed, inspected, searched, and combined across datasets.

That matters because phenotyping workflows often mix field observations, UAV or
satellite imagery, sensor measurements, lab data, treatments, metadata, and
derived outputs. Instead of hard-coding those methods into one application,
LgoPy gives PhenoLab a way to package each method as a reusable block with clear
inputs, outputs, dependencies, and documentation.

Think of each data-processing or analysis step as a Lego block. One block may
calculate a vegetation index, another may validate image quality, another may
summarize plot statistics, and another may export figures for a report. The
value comes from making each block focused, documented, and composable, so teams
can assemble larger phenotyping workflows from smaller tested pieces.

## Create an image-processing LgoPy block

In this tutorial, we will show you how to create an **LgoPy block** that receives a plot-level dataset item, reads its RGB image assets, converts the images to the HSV color space, and stores the processed results as **PhenoLab artifacts**.

The complete reference implementation is available in `blocks/myblocks/image_2_hsv.py`.


<TerminalCommands
  title="inspect the example block"
  lines={[
    {type: 'input', value: 'sed -n "1,140p" blocks/myblocks/image_2_hsv.py'},
    {type: 'output', value: 'class Image2HSV(Block):'},
    {type: 'output', value: '    name = "image_2_hsv"'},
    {type: 'output', value: '    display_name = "Image to HSV"'},
  ]}
/>

## Define block metadata

In this style, a reusable LgoPy block subclasses `Block` and declares its
catalog metadata as class attributes. These fields are what make the block
discoverable and understandable in PhenoLab.

```python showLineNumbers
import logging
from io import BytesIO

from lgopy.core import Block
from PIL import Image as PILImage


class Image2HSV(Block):
    """Create visible HSV-channel JPEG artifacts from RGB plot images."""

    name = "image_2_hsv"
    display_name = "Image to HSV"
    description = "Convert RGB plot images into visible HSV-channel JPEG artifacts."
    category = "Image Processing"
    authors = ["PhenoLab", "Nav"]
    tags = ["phenolab", "rgb", "hsv", "image-processing", "artifacts"]
    version = "0.1.0"
    logger = logging.getLogger(__name__)
```

Key lines:

- Lines 4-5 import the LgoPy base class and the image reader used by the block.
- Line 8 makes `Image2HSV` a reusable LgoPy block by subclassing `Block`.
- Lines 11-17 define the searchable catalog metadata that PhenoLab can display.
- Line 18 creates a module logger so execution details can be traced while processing plots.

The same metadata can also be attached with the registration pattern used in the
LgoPy examples. This is useful when you want a hub to manage the registered
block classes explicitly:

```python showLineNumbers
from typing import Annotated

from lgopy.core import Block, InMemoryBlockHub


hub = InMemoryBlockHub()


@hub.register(
    name="image_2_hsv",
    display_name="Image to HSV",
    description="Convert RGB plot images into visible HSV-channel JPEG artifacts.",
    category="Image Processing",
    authors=["PhenoLab", "Nav"],
    tags=["phenolab", "rgb", "hsv", "image-processing", "artifacts"],
    version="0.1.0",
)
class Image2HSV(Block):
    """Create visible HSV-channel JPEG artifacts from RGB plot images."""

    def __init__(
        self,
        jpeg_quality: Annotated[int, "JPEG quality for saved HSV artifacts"] = 95,
    ) -> None:
        super().__init__()
        self.jpeg_quality = jpeg_quality
```

Key lines:

- Line 6 creates an in-memory hub that can register and manage block classes.
- Lines 9-17 attach the same catalog metadata through `@hub.register(...)`.
- Lines 24-26 use `Annotated[...]` to document a configurable block parameter.
- Line 29 stores the parameter on the instance so `call(...)` can use it later.

:::tip[Why annotations matter in PhenoLab]

Use `Annotated[...]` to describe configurable block parameters. PhenoLab uses
those annotations to inspect each parameter and render the right UI controls for
editing values before running the block.

:::

In this pattern, `@hub.register(...)` defines the block catalog attributes, and
`Annotated[...]` documents configurable parameters that should appear in the
block schema. The metadata should be specific enough that another researcher can
search the catalog and understand what the block does before opening the source
code.

## Implement the processing logic

The `call(...)` method is the executable part of the block. In this example,
PhenoLab passes a `dataset_item` dictionary containing plot metadata and assets
grouped by modality. The block looks for RGB assets, converts each image to HSV,
and writes JPEG artifacts.

```python showLineNumbers
def call(self, dataset_item: dict) -> dict:
    """Convert RGB plot images into HSV-channel visualization artifacts."""
    try:
        plot_id = dataset_item.get("plot_id")
        rgb_assets = dataset_item["assets"].get("rgb", [])

        for rgb_asset in rgb_assets:
            rgb_image = PILImage.open(rgb_asset["file_uri"])
            self.logger.info(
                f"Processing plot {plot_id} with RGB asset {rgb_asset['file_uri']}"
            )

            hsv_image = rgb_image.convert("HSV")
            hsv_visual = PILImage.merge("RGB", hsv_image.split())

            buffer = BytesIO()
            hsv_visual.save(buffer, format="JPEG", quality=95)
            image_bytes = buffer.getvalue()

            self.artifacts.save_artifact(
                f"plot_{plot_id}_hsv_{rgb_asset['id']}.jpg",
                data=image_bytes,
                artifact_type="plot_hsv_image",
                plot_id=plot_id if isinstance(plot_id, int) else None,
            )

        return {
            "status": "success",
            "plot_id": plot_id,
            "num_rgb_assets": len(rgb_assets),
        }
    except Exception as e:
        self.logger.error(f"Error processing plot {plot_id}: {e}")
        raise
```

Key lines:

- Lines 4-5 read the plot identifier and locate RGB assets in the PhenoLab dataset item.
- Line 8 opens each RGB asset from its `file_uri`.
- Lines 13-14 convert the image into HSV space and prepare a visible RGB rendering of those channels.
- Lines 19-24 save the derived JPEG through the artifact store instead of writing an unmanaged file.
- Lines 27-31 return a compact status object that can be logged or shown in the UI.

This is the key PhenoLab pattern: the block should read from the dataset item,
do one focused analysis or transformation, save derived outputs through the
artifact interface, and return a compact status payload.

## Build a reusable block package

The `if __name__ == "__main__"` section makes the script directly buildable.
Here, `format="zip"` creates a package that can be shared or installed as a
reusable LgoPy block.

<TerminalCommands
  title="build the Image2HSV block"
  lines={[
    {type: 'input', value: 'uv run python blocks/myblocks/image_2_hsv.py'},
    {type: 'output', value: 'Created image-2-hsv-block.zip'},
  ]}
/>

```python showLineNumbers
if __name__ == "__main__":
    Image2HSV.build(output_dir="image-2-hsv-block", format="zip")
```

Key lines:

- Line 1 keeps packaging available from the command line without running during import.
- Line 2 builds the block into the `image-2-hsv-block` output and emits a zip package.

## Test with a representative dataset item

For local development, create a small dictionary that matches the shape PhenoLab
passes into plot-level blocks: a `plot_id`, plot metadata, and assets grouped by
modality. The `rgb` asset needs an `id` and a readable `file_uri`.

<TerminalCommands
  title="run a focused local check"
  lines={[
    {type: 'input', value: 'python -m blocks.myblocks.image_2_hsv'},
    {type: 'output', value: 'Build the block package first, then test call(...) with a small RGB image fixture.'},
  ]}
/>

```python showLineNumbers
dataset_item = {
    "plot_id": 101,
    "plot": {"name": "Plot 101"},
    "assets": {
        "rgb": [
            {
                "id": 1,
                "file_uri": "/path/to/plot_101_rgb.jpg",
            }
        ]
    },
}

result = Image2HSV().call(dataset_item)
print(result)
```

Key lines:

- Line 2 supplies the plot identifier that can be attached to generated artifacts.
- Lines 4-11 mirror the PhenoLab asset grouping pattern, where assets are organized by modality.
- Line 8 gives the RGB asset an id, which the block uses in the generated artifact filename.
- Line 9 points to the image file that `PILImage.open(...)` will read.
- Line 15 runs the block directly with the representative dataset item.

## Generalize the pattern

The same pattern can produce many PhenoLab blocks:

- `Image2HSV` converts RGB images into HSV visualization artifacts.
- `ImageChannelStats` computes per-channel summary statistics for RGB images.
- `PlotInfo` returns plot-level metadata and asset summaries.

For a new block, keep the unit of work focused. Choose one data-processing or
analysis step, declare useful metadata, accept the PhenoLab dataset item shape,
write important outputs as artifacts, and return a small result object that can
be logged or shown in the UI.

Custom LgoPy blocks are where PhenoLab becomes collaborative. Scientists bring
the research question, developers bring robust packaging and testing, and domain
experts bring the remote-sensing and precision-agriculture methods needed to
build high-throughput phenotyping workflows.
