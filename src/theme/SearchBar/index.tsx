import type {ComponentProps, ReactNode} from 'react';
import type {DocSearchProps} from '@docsearch/react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import OriginalSearchBar from '@theme-original/SearchBar';

type SearchBarProps = ComponentProps<typeof OriginalSearchBar>;
type AskAiConfig = Exclude<DocSearchProps['askAi'], string | undefined>;

/**
 * Connect the configured assistant to Agent Studio while retaining native search.
 * @param props - SearchBar overrides supplied by the Docusaurus theme.
 * @returns The native SearchBar with the DocSearch v4 Agent Studio transport.
 */
export default function SearchBar(props: SearchBarProps): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {askAi} = siteConfig.themeConfig.algolia as {askAi?: AskAiConfig};

  // Docusaurus 3.10 rejects this flag in themeConfig; DocSearch 4.7 accepts it.
  const agentConfig = askAi ? {...askAi, agentStudio: true as const} : undefined;
  return <OriginalSearchBar {...props} askAi={agentConfig} />;
}
