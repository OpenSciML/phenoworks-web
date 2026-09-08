# PhenoWorks Agent

The PhenoWorks Agent helps you process images, analyze measurements, interpret
results, and prepare research drafts through conversation. It draws on the
datasets, methods, and evidence available through its connected workspace tools.

## Process and analyze data

Start with a concrete task:

> Can you calculate NDVI for my dataset?

> Can you apply histogram equalization to the RGB images in my dataset?

> I want to improve the lighting in these images. Can you find a suitable correction method?

The agent can search installed LgoPy blocks, inspect their requirements, check
pipeline compatibility, and submit a run. Methods depend on the installed catalog
and your inputs. NDVI needs suitable spectral bands; a lighting correction may
be designed for a particular imaging setup.

## Follow a run

Ask for progress, inspect errors, cancel a job when needed, and retrieve its
artifacts. The agent uses the same backend processing system as the pipeline UI.

> Check the status of this pipeline and find its output table when it finishes.

## Interpret the evidence

Ask questions tied to a dataset or run so the agent can retrieve the relevant
context. It can help explain what a result shows and identify details that need
further investigation.

> Can you help me interpret the differences in NDVI across my plots?

Compare methods, settings, and experimental conditions before drawing conclusions
across acquisitions. The agent's explanation is a starting point for scientific
review.

## Support manuscripts and grant proposals

Use selected results to draft preliminary-data sections, describe methods, or
organize findings for a paper or proposal.

> Can you draft a preliminary-data section for my grant proposal using these canopy-cover results?

Review the draft against the actual measurements and experimental design. The
agent's access to tools does not imply that it has read every supporting PDF or
manuscript; provide relevant text when it cannot retrieve that context.

## What needs to be configured

The API must have the agent package and a configured model provider. Workspace
actions require a reachable [PhenoWorks MCP](phenoworks-mcp.md) server, permitted
tools, and access to the selected project. Pipeline runs also need installed
blocks and a functioning worker. Start a new conversation after changing MCP
tool configuration.

Continue with [Analyze Data with the Agent](../tutorials/analyze-with-agent.md)
or [Draft Research Sections](../tutorials/draft-research-sections.md).
