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
    subtitle: 'Keep your experiments, images, sensor readings, field observations, and research documents together. Extend the platform to support other data modalities, such as laboratory measurements and genomic data.',
    features: [
      {
        id: 'field-trials', title: 'Field Trials',
        description: 'Keep your field observations organized, from whole studies to individual plots.',
        capabilities: ['Group projects, studies, datasets, and plots.', 'Keep field labels and supporting files together across visits.'],
        example: 'Create a study for the growing season and a dataset for each field visit.',
        to: '/docs/features/studies',
      },
      {
        id: 'imagery', title: 'UAV & Satellite Imagery',
        description: 'Load and visualize drone and satellite images alongside your plots and study details. Explore what you collected before choosing how to process it.',
        capabilities: ['Add images to datasets and plots.', 'Explore supported images in false color or by band, and mark areas of interest.'],
        example: 'Review your multispectral images before choosing a vegetation index.',
        to: '/docs/features/dataset-editor',
      },
      {
        id: 'sensors', title: 'Sensor Data',
        description: 'Bring sensor readings and weather observations together with your field images.',
        capabilities: ['Attach measurement files to the relevant project, study, or dataset.', 'Review weather observations in the dataset editor.'],
        example: 'Check weather observations to help explain changes between field visits.',
        to: '/docs/features/dataset-editor',
      },
      {
        id: 'documents', title: 'PDFs & Documents',
        description: 'Keep manuscripts, reference papers, protocols, and other research documents alongside your study data.',
        capabilities: ['Attach PDFs, Word documents, and supporting files to projects or studies.', 'Keep drafts and reference material close to the experiments they describe.'],
        example: 'Add a manuscript draft and the field protocol to your study so you can find them alongside its data.',
        to: '/docs/features/projects',
      },
      {
        id: 'metadata', title: 'Metadata & Treatments',
        description: 'Record the details that help you understand and compare your measurements.',
        capabilities: ['Describe your studies, datasets, and plots.', 'Keep treatment labels and experimental notes with your data.'],
        example: 'Label plot treatments so you can interpret the results later.',
        to: '/docs/features/studies',
      },
    ],
  },
  {
    id: 'analysis',
    title: 'Analysis & Evidence Building',
    subtitle: 'Turn raw data into reproducible findings with LgoPy analysis pipelines. Like Lego pieces, each block performs one task, such as calculating NDVI or measuring canopy cover. Connect compatible blocks into workflows you can share and reuse across datasets.',
    features: [
      {
        id: 'ingestion', title: 'Data Ingestion',
        description: 'Load your files into a dataset, visualize supported images, and check what is ready for processing with LgoPy blocks.',
        capabilities: ['Upload files and link them to datasets and plots.', 'Follow processing progress and check logs when needed.'],
        example: 'Upload images from a field visit and review them in the editor.',
        to: '/docs/tutorials/import-data',
      },
      {
        id: 'quality', title: 'Quality Control',
        description: 'Check your images and choose suitable processing steps before extracting measurements.',
        capabilities: ['Preview supported images and mark areas that need attention.', 'Choose available analysis blocks that match your data and quality checks.'],
        example: 'Look for poorly lit images before choosing a suitable correction method.',
        to: '/docs/features/dataset-editor',
      },
      {
        id: 'modeling', title: 'Feature Extraction',
        description: 'Use LgoPy blocks to turn images and other raw data into measurements you can analyze. Each block has a defined input and output, so compatible steps can work together.',
        capabilities: ['Find available blocks for vegetation indices, canopy cover, or other crop traits.', 'Connect compatible blocks to extract features consistently across datasets.'],
        example: 'Connect an NDVI block to a compatible block that summarizes values for each plot.',
        to: '/docs/features/analysis-modules',
      },
      {
        id: 'products', title: 'Analysis Results',
        description: 'Organize extracted measurements into tables and other outputs ready for downstream analysis.',
        capabilities: ['Save generated summaries, images, masks, and tables.', 'Review results and processing logs, then download files for further analysis.'],
        example: 'Download a table of plot measurements for your next analysis.',
        to: '/docs/features/results-exports',
      },
    ],
  },
  {
    id: 'knowledge',
    title: 'Scientific Knowledge Base',
    subtitle: 'Connect images, extracted features, tables, and documents into a shared research knowledge base. This lays the foundation for multimodal RAG, helping the agent find relevant context and support its answers with evidence from your research.',
    features: [
      {
        id: 'datasets', title: 'Datasets & Features',
        description: 'Connect raw images with the structured features extracted by LgoPy blocks. Together, they form the visual and numerical evidence for a multimodal research knowledge base.',
        capabilities: ['Browse from a project or study down to individual plots and files.', 'Find saved results alongside the data and workflow that produced them.'],
        example: 'Open a plot to review its images and find the analysis results.',
        to: '/docs/features/dataset-editor',
      },
      {
        id: 'figures', title: 'Figures & Tables',
        description: 'Keep figures and measurement tables alongside your source data, bringing visual and numerical results into the same research context.',
        capabilities: ['Keep figures and tables generated by your analysis blocks.', 'Preview supported files and download them for reports or further analysis.'],
        example: 'Download plot measurements to create a comparison chart.',
        to: '/docs/features/results-exports',
      },
      {
        id: 'models', title: 'Models & Statistics',
        description: 'Keep model results and statistical summaries with the data behind them.',
        capabilities: ['Run compatible analysis blocks from your installed catalog.', 'Save their outputs so you can return to them later.'],
        example: 'Review a model summary alongside its dataset and run details.',
        to: '/docs/features/analysis-modules',
      },
      {
        id: 'provenance', title: 'Methods & Provenance',
        description: 'See which data and methods produced a result.',
        capabilities: ['Check block versions, source code, and input requirements.', 'Review pipeline steps, run history, logs, and saved results.'],
        example: 'Check the block version and inputs before reusing a result.',
        to: '/docs/features/analysis-modules',
      },
      {
        id: 'literature', title: 'Literature & Context',
        description: 'Add the written context behind your data: papers, manuscripts, protocols, and notes. These documents form the text layer of a multimodal knowledge base.',
        capabilities: ['Attach supporting documents to projects or studies.', 'Return to those documents when reviewing your methods and results.'],
        example: 'Attach the measurement protocol used for your field study.',
        to: '/docs/features/projects',
      },
      {
        id: 'search', title: 'Search Evidence',
        description: 'Multimodal RAG means retrieving relevant context from different types of evidence, such as images, measurements, and text, to help an AI answer a question. This knowledge base provides the foundation; what the agent can retrieve depends on the connected tools and indexing available.',
        capabilities: ['Browse datasets, review their summaries, and find relevant analysis methods.', 'Use evidence available through connected tools to support interpretation and research drafts.'],
        example: '“Can you explain these canopy-cover results using the dataset and method details available to you?”',
        to: '/docs/features/analysis-modules',
      },
      {
        id: 'trace', title: 'Trace Methods',
        description: 'Follow a result back through the steps that produced it.',
        capabilities: ['Check the code and version of the analysis block.', 'Review run details, logs, and saved outputs.'],
        example: 'Check how traits were measured before comparing two result tables.',
        to: '/docs/features/analysis-modules',
      },
      {
        id: 'compare', title: 'Compare Results',
        description: 'Bring results together to explore differences across plots, dates, or treatments.',
        capabilities: ['Find saved results and the datasets they came from.', 'Export measurements for comparison in your preferred analysis tools.'],
        example: 'Export measurements from two dates and compare them in a notebook.',
        to: '/docs/features/results-exports',
      },
      {
        id: 'export', title: 'Download Results',
        description: 'Download your results to share them or continue working elsewhere.',
        capabilities: ['Preview supported results and download files or tables.', 'Retrieve results from scripts using an API key.'],
        example: 'Download a measurement table and supporting files for a collaborator.',
        to: '/docs/features/results-exports',
      },
    ],
  },
  {
    id: 'agent',
    title: 'PhenoWorks Agent',
    subtitle: 'Work with an AI assistant to process images, extract features, and analyze your data using available LgoPy blocks. Ask it to help interpret results and draft preliminary-data sections for manuscripts or grant proposals, drawing on the datasets, methods, and evidence it can retrieve from your workspace.',
    features: [
      {
        id: 'agent-overview', title: 'PhenoWorks Agent',
        description: 'Ask the agent to help turn your data and extracted features into insights and research drafts. It can support processing, analysis, interpretation, and writing using your available data and tools.',
        capabilities: ['Find your datasets, features, and saved results.', 'Choose compatible analysis blocks, run pipelines, and follow progress.', 'Discuss findings and draft research sections based on your results.'],
        example: '“Can you calculate NDVI for my dataset?”',
        to: '/docs/features/phenoworks-agent',
      },
      {
        id: 'process', title: 'Process & Analyze Data',
        description: 'Ask the agent to improve your images, extract measurements, or analyze features using compatible methods available in your workspace.',
        capabilities: ['Find suitable blocks for tasks such as lighting correction, histogram equalization, or vegetation-index calculation.', 'Run compatible pipelines and retrieve images, measurements, and analysis results.'],
        example: '“Can you apply histogram equalization to the RGB images in my dataset?”',
        to: '/docs/features/phenoworks-agent',
      },
      {
        id: 'interpret', title: 'Understand Results',
        description: 'Explore your analysis results with an assistant that can refer to your data and run details.',
        capabilities: ['Retrieve dataset summaries, pipeline details, and saved results.', 'Ask what the results show and what needs a closer look.'],
        example: '“Can you help me interpret the differences in NDVI across my plots?”',
        to: '/docs/features/phenoworks-agent',
      },
      {
        id: 'support', title: 'Support Research Outputs',
        description: 'Use your measurements, methods, and results to draft preliminary-data sections for manuscripts or grant proposals.',
        capabilities: ['Ask for a draft based on selected datasets and analysis results.', 'Review the interpretation, check supporting evidence, and refine the text for your audience.'],
        example: '“Can you draft a preliminary-data section for my grant proposal using these canopy-cover results?”',
        to: '/docs/features/phenoworks-agent',
      },
    ],
  },
];

export const learning: WorkflowFeature = {
  id: 'learning', title: 'Continuous Learning',
  description: 'Use each round of research to improve the next: add data, review results, and refine your methods.',
  capabilities: ['Add new observations, reference material, and research notes.', 'Update your analysis blocks and compare results from the revised workflow.'],
  example: 'Refine a method after reviewing an unexpected result, then try it on a new dataset.',
  to: '/docs/features/analysis-modules',
};

export const outcomes: readonly WorkflowFeature[] = [
  {
    id: 'downstream', title: 'Downstream Analysis',
    description: 'Use extracted features to explore patterns and answer your research questions.',
    capabilities: ['Ask the agent to help analyze measurements and interpret results with available tools.', 'Download features for further work in notebooks or statistical software.'],
    example: '“Can you summarize canopy-cover measurements by treatment?”',
    to: '/docs/features/results-exports',
  },
  {
    id: 'discovery', title: 'Scientific Discovery',
    description: 'Use your results to ask new questions and plan the next experiment.',
    capabilities: ['Review findings alongside the experimental conditions and methods.', 'Investigate promising patterns and check whether they hold up.'],
    example: 'Use a recurring trait pattern to plan a follow-up experiment.',
    to: '/docs/',
  },
  {
    id: 'manuscripts', title: 'Manuscripts',
    description: 'Work with the agent to turn your methods and results into a draft for your manuscript.',
    capabilities: ['Gather figures, tables, and method details.', 'Ask the agent to help draft explanations, then review and refine them.'],
    example: '“Can you draft a preliminary-results section for my manuscript from these plot measurements?”',
    to: '/docs/features/phenoworks-agent',
  },
  {
    id: 'grants', title: 'Grant Proposals',
    description: 'Work with the agent to explain how your preliminary findings support a proposed study.',
    capabilities: ['Gather preliminary findings and the methods behind them.', 'Draft a preliminary-data section, then review its claims against your results.'],
    example: '“Can you use my pilot-study results to draft the preliminary-data section of a grant proposal?”',
    to: '/docs/features/phenoworks-agent',
  },
];
