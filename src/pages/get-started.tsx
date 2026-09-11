import type {ReactNode} from 'react';
import {FiBookOpen, FiDatabase, FiFileText, FiLayers, FiMessageCircle, FiSearch} from 'react-icons/fi';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './get-started.module.css';

const SIGNUP_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfs6dAI3IQofL37Zmodcbr3v7B1f0_09GoUnwPrqVkgOdvf6g/viewform';

type Capability = {
  icon: ReactNode;
  title: string;
  body: string;
};

const CAPABILITIES: Capability[] = [
  {
    icon: <FiDatabase />,
    title: 'Bring your research data together',
    body: 'Your study begins with data from many sources: a UAV flight, satellite images, environmental sensors, and observations in the field. PhenoWorks gives your raw multimodal sensor data a shared workspace. Bring it together with the studies, plots, and notes that tell the story of your experiment.',
  },
  {
    icon: <FiLayers />,
    title: 'Turn raw data into structured features',
    body: 'With your data in place, you can start turning it into something you can analyze. Build a reusable workflow that transforms raw sensor data into structured features for downstream analysis. When the next dataset arrives, apply the same pipeline to compatible data, keeping your process consistent and your analysis more reproducible.',
  },
  {
    icon: <FiBookOpen />,
    title: 'Build a shared research knowledge base',
    body: 'As results take shape, your research knowledge base grows. PhenoWorks stores and organizes your source data, extracted features, figures, and documents with their study context. When you or a teammate return to a finding, the evidence is there to help you understand it and take the next step.',
  },
  {
    icon: <FiMessageCircle />,
    title: 'Explore your data with the support of an AI assistant',
    body: 'Now imagine an AI research assistant by your side as new questions emerge. Ask it to find a dataset, run an analysis, or help you understand an unexpected result. The PhenoWorks Agent draws on the data and tools connected to your workspace to support your next step, in plain language.',
  },
  {
    icon: <FiSearch />,
    title: 'Trace your results back to the methods',
    body: 'A promising pattern appears, and you want to know how it was produced. Follow the result back through its analysis steps, block versions, run logs, and saved outputs. You and your collaborators can check the methods before comparing results or building on the finding.',
  },
  {
    icon: <FiFileText />,
    title: 'Turn your findings into research contributions',
    body: 'Your findings are ready for the next chapter. Take structured features into your preferred statistical tools and notebooks, or ask the agent to help draft manuscript and grant sections from your results. Review the evidence, refine the story, and let what you have learned guide your next experiment.',
  },
];

/** Render the sign-up landing page: a plain-language pitch beside the access form. */
export default function GetStarted(): ReactNode {
  return (
    <Layout
      title="Get Started"
      description="Turn raw multimodal sensor data into structured features and research insights with reusable analysis workflows and an AI assistant. Request access to PhenoWorks.">
      <main className={styles.page}>
        <div className={styles.grid}>
          <section className={styles.pitch}>
            <p className={styles.eyebrow}>What is PhenoWorks?</p>
            <Heading as="h1" className={styles.headline}>
              Your data, analysis, and AI research assistant in one workspace.
            </Heading>
            <p className={styles.lede}>
              The analysis of your latest field experiments reveals promising
              results. Months later, a colleague wants to try your pipeline on
              new data. Can you retrace the steps, recall the parameters, and
              explain how to run it again? PhenoWorks helps you turn raw
              multimodal sensor data into structured features and data
              artifacts using reusable analytical workflows. Saved run details,
              method versions, and outputs help you revisit your analysis and
              share the process with others. Along the way, the PhenoWorks
              Agent helps you explore your data, run available analyses, and
              make sense of the results. Just ask in plain language.
            </p>

            <ul className={styles.capabilities}>
              {CAPABILITIES.map((capability) => (
                <li className={styles.capability} key={capability.title}>
                  <h2 className={styles.capabilityTitle}>
                    <span className={styles.capabilityIcon} aria-hidden="true">
                      {capability.icon}
                    </span>{' '}
                    {capability.title}
                  </h2>
                  <p className={styles.capabilityBody}>{capability.body}</p>
                </li>
              ))}
            </ul>

            <p className={styles.footnote}>
              Built for crop phenotyping, breeding programmes, and agronomy
              research. Open source and designed to run on your own
              infrastructure, with reusable analysis blocks you can extend as
              your research evolves.
            </p>
          </section>

          <aside className={styles.signup}>
            <div className={styles.signupCard}>
              <h2 className={styles.signupTitle}>Become an early adopter and try PhenoWorks with your data</h2>
              <p className={styles.signupBody}>
                Have data to explore or a workflow you want to improve? Tell us
                what you are working on and how you would like to use
                PhenoWorks. Join us as an early adopter and be among the first
                to try it in your research.
              </p>
              <Link
                className={`button button--primary button--lg ${styles.signupButton}`}
                href={SIGNUP_FORM_URL}>
                Request access
              </Link>
              <p className={styles.signupMeta}>
                Takes about two minutes.
              </p>

              <hr className={styles.signupDivider} />

              <p className={styles.signupAlt}>
                Or see how it fits your research first.
              </p>
              <div className={styles.signupLinks}>
                <Link
                  className={`button button--lg ${styles.signupLinkButton}`}
                  to="/docs/tutorials/first-project">
                  Go to tutorials
                </Link>
                <Link
                  className={`button button--lg ${styles.signupLinkButton}`}
                  to="/docs/">
                  Software overview
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
