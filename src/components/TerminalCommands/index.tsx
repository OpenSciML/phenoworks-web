import React from 'react';

import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

import styles from './index.module.css';

type TerminalLine = {
  type?: 'input' | 'output' | 'comment';
  value: string;
};

type TerminalCommandsProps = {
  title?: string;
  language?: string;
  prompt?: string;
  lines: TerminalLine[];
};

function commandsToScript(lines: TerminalLine[]) {
  return lines
    .filter((line) => line.type !== 'output')
    .map((line) => (line.type === 'comment' ? `# ${line.value}` : line.value))
    .join('\n');
}

export default function TerminalCommands({
  title = 'phenoworks terminal',
  language = 'bash',
  prompt = '$ ',
  lines,
}: TerminalCommandsProps) {
  const script = commandsToScript(lines);
  const promptStyle = {'--terminal-prompt': `"${prompt}"`} as React.CSSProperties;

  return (
    <div className={styles.tabs}>
      <Tabs>
        <TabItem value="commands" label="Commands">
          <CodeBlock language={language}>{script}</CodeBlock>
        </TabItem>
        <TabItem value="terminal" label="Terminal">
          <div className={styles.terminal}>
            <div className={styles.chrome} aria-hidden="true">
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.title}>{title}</span>
            </div>
            <pre className={styles.body} style={promptStyle}>
              {lines.map((line, index) => (
                <span
                  className={`${styles.line} ${
                    line.type === 'output'
                      ? styles.output
                      : line.type === 'comment'
                        ? styles.comment
                        : styles.input
                  }`}
                  key={`${line.type ?? 'input'}-${index}-${line.value}`}
                >
                  {line.type === 'comment' ? `# ${line.value}` : line.value}
                </span>
              ))}
            </pre>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
}
