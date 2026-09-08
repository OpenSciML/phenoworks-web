# Tutorial: Analyze Data with the Agent

Use the PhenoWorks Agent to choose a method, run it on a dataset, and review the
results. Start with a small dataset so you can check the output before processing
more images.

## Before you start

Sign in to an account with access to your dataset. The agent needs a configured
model, a reachable [MCP server](connect-mcp.md), suitable installed blocks, and a
running pipeline worker.

## 1. Identify the data

Open **Agent** and name the dataset or supply its ID:

> I want to analyze dataset 7. What images and modalities does it contain?

Check that the returned dataset is the one you intend to use. Include the crop,
imaging setup, or research question when that information is needed to choose a method.

## 2. Ask for a processing task

For multispectral imagery:

> Can you calculate NDVI for this dataset? Check the available bands and explain which inputs the method needs.

Confirm the NIR and red band indices before running the block. For RGB imagery,
try a suitable image-processing request instead:

> Can you apply histogram equalization to the RGB images in my dataset?

Or ask about a correction without assuming a specific block is appropriate:

> I would like to improve the lighting in these images. Can you find a correction method that fits my imaging setup?

The agent can search available blocks and inspect their input requirements.
Source and detailed metadata access may require an administrator.

## 3. Review and run

Ask the agent to check the proposed step sequence with `validate_pipeline_steps`.
Review the dataset, method version, and parameters, then ask it to run the pipeline.
Some clients show a separate confirmation form; others submit directly.

Keep the returned pipeline ID. It identifies the analysis job; the operation ID
refers to the background task and is not interchangeable with it.

## 4. Follow progress and inspect outputs

> Check this pipeline's progress and retrieve its output table when it is complete.

If the run fails, ask for its error and logs before trying again. If it succeeds,
open the artifacts in **Analysis Pipelines** and compare a few outputs with the
source data. An HTTP submission response alone does not establish success.

## 5. Interpret the result

> Can you help me interpret the differences in NDVI across these plots? Identify any missing treatment or acquisition information.

Check the explanation against the measurements and study design. Continue with
[Draft Research Sections](draft-research-sections.md) when you have results ready
to describe.
