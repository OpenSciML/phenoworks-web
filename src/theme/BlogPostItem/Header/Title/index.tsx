import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import OriginalTitle from '@theme-original/BlogPostItem/Header/Title';
import type {Props} from '@theme/BlogPostItem/Header/Title';
import styles from './styles.module.css';

/**
 * Add a pinned badge to blog list titles.
 * @param props - Props forwarded to the original Docusaurus title.
 * @returns The title with a badge for pinned list entries.
 */
export default function BlogPostItemHeaderTitle(props: Props): ReactNode {
  const {metadata, isBlogPostPage} = useBlogPost();

  if (isBlogPostPage || metadata.frontMatter.pinned !== true) {
    return <OriginalTitle {...props} />;
  }

  return (
    <div className={styles.titleRow}>
      <OriginalTitle {...props} className={clsx(props.className, styles.title)} />
      <span className={styles.badge}>
        <span aria-hidden="true">📌</span> Pinned
      </span>
    </div>
  );
}
