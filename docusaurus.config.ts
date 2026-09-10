import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'PhenoWorks',
  tagline: 'Crop phenotyping workspace for field studies, imagery, pipelines, and derived data products.',
  favicon: 'img/phenoworks-logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://phenoworks.org',
  // The custom domain serves the website from its root.
  baseUrl: '/',
  deploymentBranch: "main",
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'OpenSciML',
  projectName: 'phenoworks-web',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/OpenSciML/phenoworks-web/tree/dev/',
        },
        blog: {
          showReadingTime: true,
          routeBasePath: 'blog',
          blogTitle: 'PhenoWorks Blog',
          blogDescription: 'Project updates, release notes, and development notes from PhenoWorks.',
          editUrl:
            'https://github.com/OpenSciML/phenoworks-web/tree/dev/',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    image: 'img/phenoworks-hero-banner.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'PhenoWorks',
      logo: {
        alt: 'PhenoWorks logo',
        src: 'img/phenoworks-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/team', label: 'Team', position: 'left'},
        {
          href: 'https://github.com/OpenSciML/phenoworks-web',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Install on Windows',
              to: '/blog/install-phenoworks-on-windows',
            },
          ],
        },
        {
          title: 'Platform',
          items: [
            {
              label: 'Dataset Editor',
              to: '/docs/features/dataset-editor',
            },
            {
              label: 'Analysis Modules',
              to: '/docs/features/analysis-modules',
            },
            {
              label: 'Analysis Pipelines',
              to: '/docs/features/analysis-pipelines',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Team',
              to: '/team',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/OpenSciML/phenoworks-web',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PhenoWorks contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['powershell', 'ini'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'forest'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
