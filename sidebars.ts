import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'index',
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/projects',
        'features/studies',
        'features/dataset-editor',
        'features/analysis-modules',
        'features/analysis-pipelines',
        'features/results-exports',
        'features/scientific-knowledge-base',
        'features/phenoworks-mcp',
        'features/phenoworks-agent',
        'features/users-api-keys',
      ],
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'tutorials/first-project',
        'tutorials/import-data',
        'tutorials/run-workflow',
        'tutorials/view-export-results',
        'tutorials/analyze-with-agent',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Tutorials',
      collapsed: true,
      items: [
        'tutorials/configure-settings',
        'tutorials/connect-mcp',
        'tutorials/draft-research-sections',
      ],
    },
  ],
};

export default sidebars;
