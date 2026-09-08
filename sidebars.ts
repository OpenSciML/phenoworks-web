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
      label: 'Getting Started',
      link: {type: 'doc', id: 'getting-started'},
      items: [
        'getting-started/installation',
        'getting-started/configuration',
        'getting-started/first-project',
      ],
    },
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
        'features/phenolab-agent',
        'features/users-api-keys',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/first-project',
        'tutorials/import-data',
        'tutorials/configure-settings',
        'tutorials/run-workflow',
        'tutorials/view-export-results',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: ['deployment/docker-compose', 'deployment/gcp'],
    },
    'faq',
    'troubleshooting',
  ],
};

export default sidebars;
