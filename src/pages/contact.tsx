import {useEffect, useRef, useState, type FormEvent, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './contact.module.css';

/**
 * Google Apps Script web app that appends submissions to the shared
 * "PhenoWorks contact form" sheet. See scripts/contact-form.gs for the backend
 * and its one-time setup steps.
 */
const CONTACT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwCXG1nu1DAiOVSzRBls_lIc8WNUsOwpWeH3nM0dUoFS7o5t75y9WqWdnYG3W2wr2vf/exec';

const MESSAGE_MAX_LENGTH = 5000;

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Render the contact page: a short pitch beside a form that writes to the team sheet. */
export default function Contact(): ReactNode {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const openedAt = useRef(0);

  // Recorded in the browser so the backend can reject instant submissions,
  // which are bots. Set on mount rather than at module scope, where a prerender
  // would bake in build time.
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = {
      ...Object.fromEntries(new FormData(form).entries()),
      elapsedMs: Date.now() - openedAt.current,
    };

    setStatus('sending');
    setError('');

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        // text/plain keeps this a "simple" CORS request. Apps Script cannot
        // answer a preflight, so application/json would fail before it was sent.
        headers: {'Content-Type': 'text/plain;charset=utf-8'},
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {ok?: boolean; error?: string};
      if (!result.ok) {
        throw new Error(result.error || 'Could not send your message.');
      }
      form.reset();
      setStatus('sent');
    } catch (submitError) {
      // The visitor gets a calm sentence; the real cause goes to the console so
      // a developer can tell a CORS rejection from a validation failure.
      console.error('[contact form]', submitError);
      setError(
        'We could not send that. Check your connection and try again, or email the team directly.',
      );
      setStatus('error');
    }
  }

  const sending = status === 'sending';

  return (
    <Layout
      title="Contact"
      description="Ask a question, report a problem, or tell the PhenoWorks team what you need from the platform.">
      <main className={styles.page}>
        <div className={styles.grid}>
          <section className={styles.intro}>
            <p className={styles.eyebrow}>Contact</p>
            <Heading as="h1" className={styles.headline}>
              Tell us what is working, and what is not.
            </Heading>
            <p className={styles.lede}>
              PhenoWorks is in beta and shaped by the people using it. Whether
              you have hit a bug, need a workflow we do not support yet, or want
              to talk about using the platform in your own research, we read
              everything that comes through here.
            </p>

            <dl className={styles.alt}>
              <dt className={styles.altTerm}>Found a bug in the code?</dt>
              <dd className={styles.altDetail}>
                Opening a{' '}
                <Link href="https://github.com/OpenSciML/phenoworks-web/issues">
                  GitHub issue
                </Link>{' '}
                gets a technical problem in front of the developers fastest.
              </dd>

              <dt className={styles.altTerm}>Want to try PhenoWorks?</dt>
              <dd className={styles.altDetail}>
                Use the <Link to="/get-started">access request form</Link>{' '}
                instead — it asks the questions we need to set you up.
              </dd>

              <dt className={styles.altTerm}>Looking for someone specific?</dt>
              <dd className={styles.altDetail}>
                The <Link to="/team">team page</Link> lists everyone working on
                the project.
              </dd>
            </dl>
          </section>

          <section className={styles.formPanel}>
            <div className={styles.formCard}>
              {status === 'sent' ? (
                <div className={styles.success} role="status">
                  <h2 className={styles.successTitle}>Thanks — that reached us.</h2>
                  <p className={styles.successBody}>
                    Your message is with the PhenoWorks team. If you asked
                    something that needs an answer, we will reply to the address
                    you gave.
                  </p>
                  <button
                    type="button"
                    className={`button button--lg ${styles.secondaryButton}`}
                    onClick={() => setStatus('idle')}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
                  <h2 className={styles.formTitle}>Send us a message</h2>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-name">
                      Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      className={styles.input}
                      id="contact-name"
                      name="name"
                      type="text"
                      maxLength={120}
                      autoComplete="name"
                      required
                      disabled={sending}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-email">
                      Email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      className={styles.input}
                      id="contact-email"
                      name="email"
                      type="email"
                      maxLength={200}
                      autoComplete="email"
                      required
                      disabled={sending}
                    />
                    <p className={styles.hint}>So we can reply. We will not use it for anything else.</p>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-message">
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      id="contact-message"
                      name="message"
                      rows={7}
                      maxLength={MESSAGE_MAX_LENGTH}
                      required
                      disabled={sending}
                    />
                  </div>

                  {/* Honeypot. Hidden from people, irresistible to bots. */}
                  <div className={styles.honeypot} aria-hidden="true">
                    <label htmlFor="contact-website">Leave this field empty</label>
                    <input
                      id="contact-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <button
                    className={`button button--primary button--lg ${styles.submit}`}
                    type="submit"
                    disabled={sending}>
                    {sending ? 'Sending…' : 'Send message'}
                  </button>

                  <p className={styles.status} role="status" aria-live="polite">
                    {status === 'error' ? (
                      <span className={styles.errorText}>{error}</span>
                    ) : (
                      'Goes to the PhenoWorks team, not to an individual.'
                    )}
                  </p>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
