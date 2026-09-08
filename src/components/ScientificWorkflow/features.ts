/** An explorable capability and the research context shown when it is selected. */
export type WorkflowFeature = {
  id: string;
  title: string;
  description: string;
  capabilities: readonly string[];
  example: string;
  to: string;
};

/** A stage in the data-to-discovery workflow, with its selectable capabilities. */
export type WorkflowStage = {
  id: string;
  title: string;
  subtitle: string;
  features: readonly WorkflowFeature[];
};

export const stages: readonly WorkflowStage[] = [
  {
    id: 'collection',
    title: 'Research Data Collection',
    subtitle: 'Organize experiments, multi-sensor data, and field observations in one research workspace.',
    features: [
      {
        id: 'field-trials', title: 'Field Trials',
        description: 'Give field observations a shared experimental home, from a research project down to individual plots.',
        capabilities: ['Organize projects, studies, acquisition datasets, and plots.', 'Keep field labels and supporting files together across collection dates.'],
        example: 'Create a study for a growing season and organize each field visit as a dataset.',
        to: '/docs/features/studies',
      },
      {
        id: 'imagery', title: 'UAV & Satellite Imagery',
        description: 'Bring remote-sensing imagery into the same workspace as your plots and experimental context.',
        capabilities: ['Register imagery as dataset and plot assets.', 'Inspect supported rasters with false-color or single-band rendering and annotate regions of interest.'],
        example: 'Review a multispectral acquisition before choosing a vegetation-index analysis module.',
        to: '/docs/features/dataset-editor',
      },
      {
        id: 'sensors', title: 'Sensor Data',
        description: 'Keep sensor measurements and environmental context alongside the imagery and observations they help explain.',
        capabilities: ['Attach measurement files to the research hierarchy.', 'Review associated weather rows in the dataset editor; processing depends on the file format and installed modules.'],
        example: 'Use weather observations as context when interpreting differences between acquisition dates.',
        to: '/docs/features/dataset-editor',
      },
      {
        id: 'lab', title: 'Lab & Genomics',
        description: 'Use the workspace to organize laboratory and genomic supporting files in the context of a study.',
        capabilities: ['Keep supporting files associated with the relevant project or study.', 'Add specialized analysis through compatible LgoPy modules; file storage does not imply a built-in genomics pipeline.'],
        example: 'Keep laboratory measurements with the field study they were collected to support.',
        to: '/docs/features/projects',
      },
      {
        id: 'metadata', title: 'Metadata & Treatments',
        description: 'Preserve the experimental context that gives a measurement scientific meaning.',
        capabilities: ['Describe projects, studies, datasets, and plots with metadata.', 'Keep treatment information and supporting records with the relevant experiment.'],
        example: 'Record treatment labels so exported plot measurements can be interpreted in context.',
        to: '/docs/features/studies',
      },
    ],
  },
  {
    id: 'analysis',
    title: 'Analysis & Evidence Building',
    subtitle: 'Turn raw data into reproducible findings with reusable LgoPy analysis pipelines.',
    features: [
      {
        id: 'ingestion', title: 'Data Ingestion',
        description: 'Move collected files into a structured, navigable dataset workspace.',
        capabilities: ['Upload files and associate assets with datasets and plots.', 'Track background file-processing operations, progress, and logs.'],
        example: 'Upload a field acquisition and inspect the resulting assets in the editor.',
        to: '/docs/tutorials/import-data',
      },
      {
        id: 'quality', title: 'Quality Control',
        description: 'Inspect inputs and choose appropriate checks before treating measurements as evidence.',
        capabilities: ['Preview supported assets and annotate regions that need attention.', 'Inspect module requirements and pipeline compatibility; scientific quality checks depend on the selected modules.'],
        example: 'Review imagery and exclude unsuitable regions before extracting plot traits.',
        to: '/docs/features/dataset-editor',
      },
      {
        id: 'modeling', title: 'Statistical Modeling',
        description: 'Use reusable analysis modules to build methods suited to your crop, sensor, and research question.',
        capabilities: ['Search and inspect versioned LgoPy modules and their input requirements.', 'Compose compatible steps for trait extraction or modeling; available methods depend on the installed catalog.'],
        example: 'Choose a compatible vegetation-index module as one step in a phenotyping workflow.',
        to: '/docs/features/analysis-modules',
      },
      {
        id: 'products', title: 'Discovery Products',
        description: 'Turn processing outputs into inspectable artifacts that researchers can reuse.',
        capabilities: ['Keep generated summaries, previews, masks, or tables as artifacts.', 'Review outputs and logs, then download files for interpretation or further analysis.'],
        example: 'Inspect a JSON result and download a table for a follow-up analysis.',
        to: '/docs/features/results-exports',
      },
    ],
  },
  {
    id: 'knowledge',
    title: 'Scientific Knowledge Base',
    subtitle: 'Connect datasets, results, methods, and literature in a searchable scientific knowledge base.',
    features: [
      {
        id: 'datasets', title: 'Datasets & Features',
        description: 'Build a connected collection of source observations and derived measurements.',
        capabilities: ['Navigate the project, study, dataset, plot, and asset hierarchy.', 'Keep generated artifacts linked to the data and processing workflow that produced them.'],
        example: 'Start with a plot, inspect its source imagery, and locate related outputs.',
        to: '/docs/features/dataset-editor',
      },
      {
        id: 'figures', title: 'Figures & Tables',
        description: 'Keep visual and tabular research outputs available for inspection and reuse.',
        capabilities: ['Store generated figures and tables as workflow artifacts when produced by a module.', 'Preview supported files and download outputs for external analysis or reporting.'],
        example: 'Download a generated measurement table to create a study comparison figure.',
        to: '/docs/features/results-exports',
      },
      {
        id: 'models', title: 'Models & Statistics',
        description: 'Keep model outputs and statistical summaries alongside the research data they describe.',
        capabilities: ['Use compatible installed modules for the required analysis.', 'Retain the files and summaries those modules produce for later review.'],
        example: 'Review a model summary together with its input dataset and run details.',
        to: '/docs/features/analysis-modules',
      },
      {
        id: 'provenance', title: 'Methods & Provenance',
        description: 'Make it easier to trace a result back to its data and computational method.',
        capabilities: ['Inspect versioned module source, metadata, and requirements.', 'Review pipeline steps, run records, logs, and related artifacts.'],
        example: 'Check which module version and inputs were used before reusing a result.',
        to: '/docs/features/analysis-modules',
      },
      {
        id: 'literature', title: 'Literature & Context',
        description: 'Keep supporting documents close to the experiment so research context is easier to recover.',
        capabilities: ['Attach supporting files to projects or studies.', 'The broader knowledge-base vision connects literature with evidence; automatic literature indexing is not assumed.'],
        example: 'Attach a measurement protocol or reference paper to the study it informs.',
        to: '/docs/features/projects',
      },
      {
        id: 'search', title: 'Search Evidence',
        description: 'Find the data and analytical methods relevant to a research question.',
        capabilities: ['Browse datasets and inspect their summaries.', 'Search the analysis module catalog; semantic module search depends on deployment configuration.'],
        example: 'Find installed modules relevant to vegetation indices and inspect their requirements.',
        to: '/docs/features/analysis-modules',
      },
      {
        id: 'trace', title: 'Trace Methods',
        description: 'Follow the computational context behind a result before deciding how to interpret it.',
        capabilities: ['Review module implementation and version information.', 'Inspect available job details, logs, and artifacts for a processing workflow.'],
        example: 'Check the method used for trait extraction before comparing two result tables.',
        to: '/docs/features/analysis-modules',
      },
      {
        id: 'compare', title: 'Compare Results',
        description: 'Use retained outputs as the starting point for comparisons across plots, dates, or treatments.',
        capabilities: ['Locate artifacts and their dataset context.', 'Export outputs for a comparison in your preferred analysis environment; comparability depends on methods and inputs.'],
        example: 'Export matching plot measurements from two dates and compare them in a notebook.',
        to: '/docs/features/results-exports',
      },
      {
        id: 'export', title: 'Export Assets',
        description: 'Take evidence out of the workspace when you need to share it or continue analysis elsewhere.',
        capabilities: ['Preview supported artifacts and download binary or tabular outputs.', 'Use API keys for authorized scripted retrieval of outputs.'],
        example: 'Download a generated table and its supporting files for a collaborator.',
        to: '/docs/features/results-exports',
      },
    ],
  },
  {
    id: 'agent',
    title: 'PhenoLab Agent',
    subtitle: 'Analyze data, interpret evidence, and develop research outputs with an assistant grounded in your data.',
    features: [
      {
        id: 'agent-overview', title: 'PhenoLab Agent',
        description: 'A conversational assistant that can use connected PhenoLab tools to help you explore datasets, choose methods, and follow analysis workflows.',
        capabilities: ['Find accessible projects and datasets, and inspect dataset summaries.', 'Search analysis blocks, inspect their inputs and source, and validate pipeline steps.', 'Submit dataset pipelines, inspect job status, cancel jobs, and retrieve artifacts through the available tools.'],
        example: '“Inspect my dataset and suggest compatible analysis blocks. Explain the inputs before running anything.”',
        to: '/docs/features/phenolab-agent',
      },
      {
        id: 'process', title: 'Process & Analyze Data',
        description: 'Ask the agent to connect a research task with the analytical tools available in your deployment.',
        capabilities: ['Search and inspect installed blocks and validate a proposed sequence of steps.', 'Use connected tools to submit a pipeline and inspect its status and outputs.'],
        example: '“Find an NDVI block and check whether its inputs match this dataset.”',
        to: '/docs/features/phenolab-agent',
      },
      {
        id: 'interpret', title: 'Interpret Grounded Evidence',
        description: 'Discuss results using the dataset information, methods, and artifacts available to the agent.',
        capabilities: ['Retrieve dataset summaries, pipeline details, and generated artifacts.', 'Ask for explanations tied to retrieved evidence and identify what still needs scientific verification.'],
        example: '“Explain this result using the run details and point out any missing context.”',
        to: '/docs/features/phenolab-agent',
      },
      {
        id: 'support', title: 'Support Research Outputs',
        description: 'Use the assistant to help explain methods and organize evidence for the next stage of your research.',
        capabilities: ['Ask for a methods outline or a summary based on retrieved run information.', 'Use the draft as a starting point for researcher review; complete manuscripts and proposals remain researcher-led outputs.'],
        example: '“Outline a methods paragraph from this pipeline and list details I still need to supply.”',
        to: '/docs/features/phenolab-agent',
      },
    ],
  },
];

export const learning: WorkflowFeature = {
  id: 'learning', title: 'Continuous Learning',
  description: 'Research is iterative: new data, analyses, literature, and expert feedback refine the next workflow.',
  capabilities: ['Add new observations and supporting context to the workspace.', 'Revise methods through versioned modules and compare subsequent outputs. This loop describes the research process, not automatic model retraining.'],
  example: 'Review an unexpected result, refine the method, and apply it to a new acquisition.',
  to: '/docs/features/analysis-modules',
};

export const outcomes: readonly WorkflowFeature[] = [
  {
    id: 'downstream', title: 'Downstream Analysis',
    description: 'Continue exploring and validating findings with the tools best suited to your next question.',
    capabilities: ['Download measurements and supporting artifacts.', 'Reuse outputs in notebooks, statistical tools, or other research workflows.'],
    example: 'Analyze exported measurements across treatments in a notebook.',
    to: '/docs/features/results-exports',
  },
  {
    id: 'discovery', title: 'Scientific Discovery',
    description: 'Use organized evidence to develop new hypotheses and decide what to investigate next.',
    capabilities: ['Review results with their experimental and methodological context.', 'Use expert interpretation to distinguish a promising pattern from a validated finding.'],
    example: 'Use a recurring trait pattern to plan a follow-up experiment.',
    to: '/docs/',
  },
  {
    id: 'manuscripts', title: 'Manuscripts',
    description: 'Use retained data, methods, and artifacts to support clear scientific communication.',
    capabilities: ['Gather tables, figures, and method details for writing.', 'Ask the agent to help outline explanations from available evidence, then review and complete the text.'],
    example: 'Build a methods outline and select supporting tables for a paper.',
    to: '/docs/features/phenolab-agent',
  },
  {
    id: 'grants', title: 'Grant Proposals',
    description: 'Use preliminary evidence and documented workflows to support plans for future research.',
    capabilities: ['Collect relevant outputs as preliminary evidence.', 'Develop aims and proposed methods with researcher review; this is a research use case, not an automated submission feature.'],
    example: 'Use pilot-study results to motivate the next field campaign.',
    to: '/docs/features/phenolab-agent',
  },
];
