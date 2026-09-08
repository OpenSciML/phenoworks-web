import type {CSSProperties, ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import ScientificWorkflow from '@site/src/components/ScientificWorkflow';
import styles from './index.module.css';

/** Render the PhenoLab homepage and its interactive capability map. */
export default function Home(): ReactNode {
  const logoSrc = useBaseUrl('/img/phenolab-logo.png');
  const heroStyle = {
    '--phenolab-hero-image': `url("${useBaseUrl('/img/phenolab-hero-banner.png')}")`,
  } as CSSProperties;

  return (
    <Layout
      title="PhenoLab"
      description="PhenoLab documentation for crop phenotyping studies, imagery, pipelines, and deployment.">
      <main>
        <section className={styles.hero} style={heroStyle}>
          <div className={styles.heroText}>
            <img
              className={styles.logo}
              src={logoSrc}
              alt="PhenoLab logo"
            />
            <Heading as="h1" className={styles.title}>
              PhenoLab
            </Heading>
            <p className={styles.subtitle}>
              An agentic-first crop phenotyping platform that turns multi-sensor agricultural data into a searchable scientific knowledge base using modular, AI-powered analysis pipelines and intelligent agents that help researchers analyze data, uncover insights, and accelerate discovery.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs/getting-started">
                Get Started
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/">
                Software Overview
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.workflowSection}>
          <ScientificWorkflow />
        </section>
      </main>
    </Layout>
  );
}
