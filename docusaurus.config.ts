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
          customCss: [
            require.resolve('instantsearch.css/components/chat.css'),
            './src/css/custom.css',
            './src/components/AskPhenoWorks/styles.css',
          ],
        },
        // Google Analytics 4. Use the preset's plugin rather than pasting
        // Google's gtag.js snippet into the page: this site is a single-page
        // app, so a raw snippet would report one page_view on first load and
        // nothing for the client-side navigations that follow. The plugin
        // hooks the router and reports each route change.
        //
        // It only runs in production builds — `yarn start` sends nothing,
        // which is what you want while developing.
        gtag: {
          trackingID: 'G-XS4PT7GKSK',
          // Truncates the visitor's IP before it is stored.
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    algolia: {
      // The application ID provided by Algolia
      appId: 'FWYPFEFWZA',

      // Public API key: it is safe to commit it
      apiKey: 'c1b68b37278c54418a15e5224c83495a',

      indexName: 'phenoworks.org',

      // Must stay false while Ask AI runs on Agent Studio: contextual search
      // injects `facetFilters` into searchParameters, and Agent Studio rejects
      // that key outright ("invalid searchParameters"). DocSearch's own types
      // say as much — AgentStudioSearchParameters is
      // Omit<AskAiSearchParameters, 'facetFilters'>. Little is lost: the
      // filters it adds scope results to a docs version and locale, and this
      // site has one of each.
      contextualSearch: false,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: 'external\\.com|domain\\.com',

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      // Optional: whether you want to use the new Ask AI feature (undefined by default)
      askAi: {
        assistantId: 'b9fc01e7-c4f3-4609-a879-f1768d45c78d',
        indexName: 'phenoworks.org',
        apiKey: 'c1b68b37278c54418a15e5224c83495a',
        appId: 'FWYPFEFWZA',
        // Enable after configuring suggested questions in the Algolia assistant dashboard.
        suggestedQuestions: false,
      },

      //... other Algolia params
    },
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
        {to: '/contact', label: 'Contact', position: 'left'},
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
              to: '/docs/tutorials/first-project',
            },
            {
              label: 'First Project',
              to: '/docs/tutorials/first-project',
            },
          ],
        },
        {
          title: 'Platform',
          items: [
            {
              label: 'Import Data',
              to: '/docs/tutorials/import-data',
            },
            {
              label: 'Run a Workflow',
              to: '/docs/tutorials/run-workflow',
            },
            {
              label: 'View & Export Results',
              to: '/docs/tutorials/view-export-results',
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
              label: 'Contact',
              to: '/contact',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/OpenSciML/phenoworks-web',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PhenoWorks contributors`,
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
