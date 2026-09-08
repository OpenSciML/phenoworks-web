# Tutorial: Importing Data

## Objective

Create a dataset, add plots, and register plot assets in the editor.

## Prerequisites

- A project and study exist.
- Asset files are available on disk.
- Dataset modality choices are known.

## Estimated Time

20 minutes.

## Steps

1. Open **Editor**.
2. Select the target project and study in the data tree.
3. Create a dataset.
4. Enable the modalities that match your files.
5. Create plots under the dataset.
6. Register or upload an asset for each plot.
7. Select an asset to confirm that the preview renders.

![Dataset editor](../images/dataset-editor.svg)

## Expected Result

The editor tree shows the dataset, plots, and registered assets. Selecting an asset loads it in the viewer or shows an appropriate preview state.

## Common Mistakes

- Registering assets under the wrong plot.
- Enabling too few modalities for the dataset.
- Using inconsistent plot names.

## Add documents and prepare for analysis

Attach a field protocol, reference PDF, or manuscript draft to the project or
study in the editor. Keep these supporting files separate from the plot image
assets expected by an analysis block.

Before processing, confirm that plot labels and modalities match the files.
For NDVI, verify that the multispectral images include the required red and
near-infrared bands and record their order. For RGB processing, inspect a few
images for lighting and contrast issues.

Continue with [Running a Workflow](run-workflow.md) or ask the
[Agent](analyze-with-agent.md) to help select a suitable method.

## Tips

For batch work, keep file names aligned with plot labels before import.
