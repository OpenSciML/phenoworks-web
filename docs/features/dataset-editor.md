# Dataset Editor

The dataset editor is the main workspace for datasets, plots, assets, visualization settings, ancillary data, and annotations.

![Dataset editor](../images/dataset-editor.svg)

## Purpose

Use the editor to build the plot-level data structure that analysis pipelines consume.

## Step-by-Step Usage

1. Open **Editor**.
2. Select the target project and study in the data tree.
3. Create a dataset for the acquisition event.
4. Enable the modalities expected for that dataset.
5. Add plots under the dataset.
6. Register or upload assets for each plot.
7. Select an asset to preview it in the viewer.
8. Adjust visualization settings for imagery when needed.
9. Create annotation groups, labels, and geometry drafts when reviewing images.

## Supported Work Areas

| Area | What it does |
| --- | --- |
| Dataset tree | Navigates datasets, plots, and assets. |
| Asset viewer | Displays previewable assets and image transformations. |
| Annotation tools | Supports pan, ROI, polygon, rectangle, and label workflows. |
| Ancillary panel | Shows weather rows associated with the selected dataset. |
| Visualization settings | Controls false-color and single-band rendering options. |

## Research documents and extracted features

Attach PDFs, protocols, manuscript drafts, and other supporting files to the
relevant project or study. Keep experimental context with the data it explains.
Available previews depend on the file type; storing a document does not
automatically index its contents for the Agent.

Once the images and plot labels are ready, use [Analysis Pipelines](analysis-pipelines.md)
to extract features or process images. Saved outputs become part of the
[Scientific Knowledge Base](scientific-knowledge-base.md), alongside their source
data and methods.

## Best Practices

- Use dataset names that describe acquisition date and modality.
- Keep plot names consistent with field labels.
- Verify modality settings before registering large asset batches.
- Save annotations before changing assets.

## Limitations

- Very large rasters may need preview generation or optimized storage to keep the browser responsive.
- Annotation drafts are asset-specific and should be saved before leaving the workflow.
