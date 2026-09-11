---
slug: phenoworks-beta-release
title: PhenoWorks Beta Is Here
authors: [phenoworks]
tags: [release-notes, development]
---

PhenoWorks beta is here: a crop phenotyping web platform that brings research data, reusable analysis methods, and an AI assistant into one workspace. Load and visualize your data, extract structured features with LgoPy blocks, and use the results to support analysis, interpretation, and research writing.

{/* truncate */}

The [interactive diagram on our landing page](/) follows this workflow from data to scientific discovery. Here is how its four stages fit together.

## 1. Research Data Collection

Start by organizing your field trials into projects, studies, datasets, and plots. Bring UAV and satellite imagery, sensor readings, field observations, metadata, and treatment labels together, then visualize supported images before choosing how to process them.

Research documents belong here too. Keep PDFs, manuscript drafts, reference papers, and protocols alongside the experiments they describe. The platform can also be extended to support other modalities, such as laboratory measurements and genomic data.

## 2. Analysis & Evidence Building

Move from **data ingestion** and **quality control** to **feature extraction** and **analysis results**. LgoPy blocks turn raw data into structured features, such as vegetation indices and canopy-cover measurements, that you can use in downstream analysis.

Like Lego pieces, each block performs one focused task with defined inputs and outputs. Connect compatible blocks into pipelines you can share and reuse across datasets. For example, an image-processing block can prepare images for a compatible feature-extraction step. Available methods depend on the installed block catalog.

Follow pipeline progress, inspect logs, and review the generated images, masks, summaries, and tables. These outputs stay connected to their source data and processing workflow.

## 3. Scientific Knowledge Base

Connect images, extracted features, figures, tables, model results, methods, and documents into a shared research knowledge base. Keep the evidence together so you can find relevant datasets, trace how measurements were produced, compare results, and download files for further work.

This lays the foundation for **multimodal RAG**: retrieving relevant context from visual, numerical, and written evidence to support an assistant's answers. What the agent can retrieve depends on the connected tools and indexing available.

## 4. PhenoWorks Agent

Work with the **PhenoWorks Agent** (`phenoworks-agent`) to process images, extract features, and analyze data using available LgoPy blocks. Describe the task in your own words:

> Can you calculate NDVI for my dataset?

> Can you apply histogram equalization to the RGB images in my dataset?

The agent can help choose a suitable method, check its inputs, run a compatible pipeline, and retrieve the results. You can then ask it to interpret differences across plots or draft a preliminary-data section from selected results.

**PhenoWorks MCP** (`phenoworks-mcp`) provides the Model Context Protocol connection between compatible AI assistants and the PhenoWorks API. Its tools support finding datasets, inspecting analysis blocks, validating and running pipelines, tracking jobs, and retrieving outputs within the user's access permissions.

Learn more about the [PhenoWorks Agent](/docs/tutorials/analyze-with-agent) and its connected tools.

## Research outputs

The options at the bottom of the diagram show what this workflow can support:

- **Downstream Analysis:** explore extracted features with the agent's available tools or export them to notebooks and statistical software.
- **Scientific Discovery:** investigate patterns, develop new questions, and plan follow-up experiments.
- **Manuscripts:** bring methods, figures, and measurements together, and work with the agent on preliminary-results drafts.
- **Grant Proposals:** use pilot-study findings to draft preliminary-data sections that support a proposed study.

For example: “Can you draft a preliminary-data section for my grant proposal using these canopy-cover results?” Researchers review the interpretation and supporting evidence, then refine the draft for their audience.

## Continuous Learning

Research feeds back into the next workflow. Add new observations, review unexpected results, refine your analysis blocks, and compare the revised outputs. This cycle connects each round of data collection and analysis with the questions that come next.

We will use this blog to share release notes, tutorials, and development updates as PhenoWorks evolves.

Interested in PhenoWorks? [Express your interest through our Google Form](https://docs.google.com/forms/d/e/1FAIpQLSfs6dAI3IQofL37Zmodcbr3v7B1f0_09GoUnwPrqVkgOdvf6g/viewform).
