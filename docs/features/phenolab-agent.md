# PhenoLab Agent

The PhenoLab Agent is a conversational assistant connected to the research workspace through authorized tools. It can help you explore datasets, inspect analytical methods, and follow processing workflows. Its actions depend on the tools enabled in your deployment, your access to the data, and the configured model.

## Explore your workspace

Ask the agent to list accessible projects and datasets or inspect a dataset summary. This provides context before choosing an analysis method.

> Inspect my dataset and describe its available assets and modalities.

## Choose and inspect methods

The connected PhenoLab tools can search installed analysis blocks, describe their inputs and requirements, inspect their source, and validate a proposed sequence of pipeline steps. The available scientific methods depend on the installed LgoPy catalog.

> Find a vegetation-index block and check whether its inputs match this dataset. Explain the method before running anything.

## Follow analysis workflows

When the corresponding tools are enabled, the agent can submit a dataset pipeline, inspect pipeline jobs, cancel a job, list its artifacts, and download an artifact for inspection. Runs depend on the configured workers and the requirements of the chosen modules.

> Check this pipeline job and help me locate its output table.

## Interpret and communicate evidence

Ask the agent to explain retrieved results in the context of the dataset and method, or help outline a methods description. Research interpretations and drafts should be checked against the source evidence. The agent's access to workspace tools does not imply automatic access to every document or an indexed scientific literature collection.

> Summarize the available evidence from this run, identify missing context, and outline a methods paragraph for review.

Manuscripts, grant proposals, and scientific discoveries are researcher-led uses of the resulting evidence. They are not automatic publishing or submission features.

## Related capabilities

- [Dataset editor](dataset-editor.md)
- [Analysis modules](analysis-modules.md)
- [Results and exports](results-exports.md)
