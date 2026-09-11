import {useMemo, type ComponentProps, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import {liteClient} from 'algoliasearch/lite';
import {Chat, ChatSidePanelLayout, ChatTrigger, InstantSearch} from 'react-instantsearch';

type ChatProps = ComponentProps<typeof Chat>;
type EmptyProps = Parameters<NonNullable<ChatProps['emptyComponent']>>[0];
type ErrorProps = Parameters<NonNullable<ChatProps['messagesErrorComponent']>>[0];
type ResultProps = Parameters<NonNullable<ChatProps['itemComponent']>>[0];
type SearchConfiguration = {
  appId: string;
  apiKey: string;
  indexName: string;
  askAi?: {assistantId: string};
};

const questions = ['How do I upload data?', 'How do I run an analysis workflow?', 'How do I create my first project?'];

/** Show starting questions. @param context - The widget's current conversation controls. */
function Welcome({context}: EmptyProps): React.JSX.Element {
  return <div className="phenoworks-chat-welcome">
    <span className="phenoworks-chat-eyebrow">YOUR DOCUMENTATION ASSISTANT</span>
    <h2>What are you working on?</h2>
    <p>Ask about importing data, running analyses, or finding your way around PhenoWorks.</p>
    <div className="phenoworks-chat-questions">{questions.map(question =>
      <button key={question} type="button" onClick={() => void context.sendMessage?.({text: question})}>{question}<span aria-hidden="true">↗</span></button>,
    )}</div>
    <small>Answers are based on the PhenoWorks documentation.</small>
  </div>;
}

/** Render an actionable connection error. @param props - Error details and retry controls. */
function ConnectionError(props: ErrorProps): React.JSX.Element {
  return <div className="phenoworks-chat-error" role="alert">
    <strong>We couldn’t complete that answer.</strong>
    <p>The assistant may be unavailable or your connection may be interrupted. Try again, or use the documentation search.</p>
    <button type="button" onClick={() => void props.context.regenerate()}>Try again</button>
  </div>;
}

/** Render a documentation source, accepting only web URLs. @param item - An Algolia search hit. */
function DocumentationSource({item}: ResultProps): React.JSX.Element {
  const hierarchy = item.hierarchy as Record<string, string | null> | undefined;
  const title = hierarchy?.lvl1 || hierarchy?.lvl0 || (typeof item.title === 'string' ? item.title : 'Documentation');
  const url = typeof item.url === 'string' && /^https?:\/\//i.test(item.url) ? item.url : undefined;
  return <article className="phenoworks-chat-source">
    <small>DOCUMENTATION</small>
    {url ? <Link to={url}>{title}</Link> : <strong>{title}</strong>}
    {typeof item.content === 'string' ? <p>{item.content}</p> : null}
  </article>;
}

/** Label the floating chat trigger. @param isOpen - Whether the panel is visible. */
function TriggerLabel({isOpen}: {isOpen: boolean}): React.JSX.Element {
  return <span className="phenoworks-chat-trigger-label"><span aria-hidden="true">{isOpen ? '→' : '✦'}</span>{isOpen ? 'Close chat' : 'Ask PhenoWorks'}</span>;
}

/** Render the persistent Agent Studio panel using the website's public search configuration. */
export default function AskPhenoWorks(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const config = siteConfig.themeConfig.algolia as SearchConfiguration;
  const searchClient = useMemo(() => liteClient(config.appId, config.apiKey), [config.appId, config.apiKey]);
  if (!config.askAi?.assistantId) return null;

  return <InstantSearch searchClient={searchClient} indexName={config.indexName} insights={false}>
    <Chat
      agentId={config.askAi.assistantId}
      layoutComponent={ChatSidePanelLayout}
      classNames={{root: 'phenoworks-chat'}}
      emptyComponent={Welcome}
      messagesErrorComponent={ConnectionError}
      itemComponent={DocumentationSource}
      showReasoning={false}
      translations={{
        header: {title: 'Ask PhenoWorks', clearLabel: 'New chat', closeLabel: 'Close chat'},
        prompt: {textareaLabel: 'Your question', textareaPlaceholder: 'Ask about PhenoWorks…', disclaimer: 'AI can make mistakes. Check the linked documentation.'},
        messages: {loaderText: 'Looking through the documentation…'},
      }}
    />
    <ChatTrigger classNames={{root: 'phenoworks-chat-trigger'}} toggleIconComponent={TriggerLabel} />
  </InstantSearch>;
}
