import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './get-started.module.css';

const SIGNUP_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfs6dAI3IQofL37Zmodcbr3v7B1f0_09GoUnwPrqVkgOdvf6g/viewform';

type Capability = {
  title: string;
  body: string;
};

const CAPABILITIES: Capability[] = [
  {
    title: 'Keep every field trial in one place',
    body: 'Group your work by project, season, and plot. Drone images, sensor readings, field notes, and reference documents stay together instead of scattered across folders and drives.',
  },
  {
    title: 'Upload the images you already collect',
    body: 'Drop in a folder of plot photos or a single large aerial map. PhenoWorks sorts them by plot and by camera type, whether that is ordinary colour, thermal, or multispectral.',
  },
  {
    title: 'Measure crops without writing code',
    body: 'Pick a ready-made analysis, point it at your data, and run it. One common example measures plant vigour from near-infrared light, which shows differences in growth before your eye can see them.',
  },
  {
    title: 'Get results you can actually use',
    body: 'Every run produces a spreadsheet of measurements, one row per plot, plus any processed images. Download them and open them in Excel, R, or whatever you already work in.',
  },
  {
    title: 'Ask questions in plain language',
    body: 'A built-in assistant can look through your data, suggest which analysis fits your images, and explain what a set of results means.',
  },
  {
    title: 'Trust the numbers later',
    body: 'Each run records the exact settings and software version used, so a result from last season can be repeated, checked, or defended in a publication.',
  },
];

/** Render the sign-up landing page: a plain-language pitch beside the access form. */
export default function GetStarted(): ReactNode {
  return (
    <Layout
      title="Get Started"
      description="What PhenoWorks does, in plain language, and how to request access.">
      <main className={styles.page}>
        <div className={styles.grid}>
          <section className={styles.pitch}>
            <p className={styles.eyebrow}>What is PhenoWorks?</p>
            <Heading as="h1" className={styles.headline}>
              Turn field images into crop measurements you can compare.
            </Heading>
            <p className={styles.lede}>
              Research teams collect thousands of images of crop plots every
              season, then lose weeks getting numbers out of them. PhenoWorks
              does that work for you: you upload what you already gather in the
              field, choose an analysis, and get a table of measurements back.
            </p>

            <ul className={styles.capabilities}>
              {CAPABILITIES.map((capability) => (
                <li className={styles.capability} key={capability.title}>
                  <h2 className={styles.capabilityTitle}>{capability.title}</h2>
                  <p className={styles.capabilityBody}>{capability.body}</p>
                </li>
              ))}
            </ul>

            <p className={styles.footnote}>
              PhenoWorks is built for field research: breeding programmes,
              variety trials, and agronomy studies that compare plots against
              each other. It is open source, and it runs on your own
              infrastructure.
            </p>
          </section>

          <aside className={styles.signup}>
            <div className={styles.signupCard}>
              <h2 className={styles.signupTitle}>Request access</h2>
              <p className={styles.signupBody}>
                We are giving out access in batches. Tell us your email address
                and roughly how you plan to use PhenoWorks, and we will be in
                touch.
              </p>
              <Link
                className={`button button--primary button--lg ${styles.signupButton}`}
                href={SIGNUP_FORM_URL}>
                Sign up now
              </Link>
              <p className={styles.signupMeta}>
                Takes about two minutes. No cost.
              </p>

              <hr className={styles.signupDivider} />

              <p className={styles.signupAlt}>
                Want to look around first?{' '}
                <Link to="/docs/">Read the software overview</Link> or{' '}
                <Link to="/docs/tutorials/first-project">
                  follow the first tutorial
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
