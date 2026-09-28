import type {CSSProperties, ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import ScientificWorkflow from '@site/src/components/ScientificWorkflow';
import styles from './index.module.css';

/** Render the PhenoWorks homepage and its interactive capability map. */
export default function Home(): ReactNode {
  const logoSrc = useBaseUrl('/img/phenoworks-logo.svg');
  const heroStyle = {
    '--phenoworks-hero-image': `url("${useBaseUrl('/img/phenoworks-hero-banner.png')}")`,
  } as CSSProperties;

  return (
    <Layout
      title="PhenoWorks"
      description="PhenoWorks documentation for crop phenotyping studies, imagery, pipelines, and deployment.">
      <main>
        <section className={styles.hero} style={heroStyle}>
          <div className={styles.heroText}>
            <img
              className={styles.logo}
              src={logoSrc}
              alt="PhenoWorks logo"
            />
            <Heading as="h1" className={styles.title}>
              PhenoWorks
              <sup className={styles.betaTag}>Beta</sup>
            </Heading>
            <p className={styles.subtitle}>
              An agentic-first crop phenotyping platform that turns multi-sensor agricultural data into a searchable scientific knowledge base using modular, AI-powered analysis pipelines and intelligent agents that help researchers analyze data, uncover insights, and accelerate discovery.
            </p>
            <div className={styles.actions}>
              <Link
                className={`button button--primary button--lg ${styles.primaryCta}`}
                to="/get-started">
                Get Started
                <span className={styles.ctaArrow} aria-hidden="true">
                  →
                </span>
              </Link>
              <Link
                className={`button button--secondary button--lg ${styles.demoCta}`}
                href="https://www.youtube.com/watch?v=AIRj9YjvcjA"
                target="_blank"
                rel="noopener noreferrer">
                <span aria-hidden="true">▶</span>
                Watch Demo on YouTube
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
