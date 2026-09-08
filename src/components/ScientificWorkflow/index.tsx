'use client';

import {useId, useRef, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import {learning, outcomes, stages, type WorkflowFeature} from './features';
import {featureCaptions} from './presentation';
import WorkflowArtwork from '../WorkflowArtwork';
import WorkflowFeatureButton from '../WorkflowFeatureButton';
import styles from './styles.module.css';

/** Render the data-to-discovery map and a keyboard-accessible capability dialog. */
export default function ScientificWorkflow(): ReactNode {
  const [selected, setSelected] = useState<WorkflowFeature>(stages[3].features[0]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const dialogId = `${instanceId}-details`;
  const dialogTitleId = `${instanceId}-detail-title`;
  const imageSrc = useBaseUrl('/img/phenolab-scientific-workflow.png');

  /** Open the modal for feature, which supplies its title, capabilities, and example. */
  function showFeature(feature: WorkflowFeature): void {
    setSelected(feature);
    dialogRef.current?.showModal();
  }

  return (
    <section className={styles.workflow} aria-labelledby={titleId}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Explore PhenoLab</p>
          <h2 id={titleId}>From data to scientific discovery</h2>
          <p>Follow the research workflow. Select an icon or feature to explore its capabilities and see how it fits your research.</p>
        </div>
        <a className={styles.original} href={imageSrc} target="_blank" rel="noreferrer">View original diagram ↗</a>
      </header>

      <div className={styles.stages}>
        {stages.map((stage, index) => (
          <section
            className={`${styles.stage} ${styles[stage.id]}`}
            key={stage.id}
            aria-labelledby={`${instanceId}-${stage.id}`}>
            <div className={styles.stageHeader}>
              <span className={styles.step} aria-hidden="true">0{index + 1}</span>
              <h3 id={`${instanceId}-${stage.id}`}>{stage.title}</h3>
              <p>{stage.subtitle}</p>
            </div>

            {stage.id === 'knowledge' ? (
              <>
                <div className={styles.database} role="group" aria-label="Scientific knowledge layers">
                  {stage.features.slice(0, 5).map((feature) => (
                    <WorkflowFeatureButton
                      key={feature.id}
                      feature={feature}
                      dialogId={dialogId}
                      onSelect={showFeature}
                      className={styles.databaseLayer}
                    />
                  ))}
                </div>
                <div className={styles.knowledgeActions}>
                  {stage.features.slice(5).map((feature) => (
                    <WorkflowFeatureButton
                      key={feature.id}
                      feature={feature}
                      dialogId={dialogId}
                      onSelect={showFeature}
                      className={styles.knowledgeAction}
                    />
                  ))}
                </div>
              </>
            ) : stage.id === 'agent' ? (
              <>
                <button
                  type="button"
                  className={styles.agentHero}
                  aria-haspopup="dialog"
                  aria-controls={dialogId}
                  onClick={() => showFeature(stage.features[0])}>
                  <WorkflowArtwork name="agent-overview-v5" color className={styles.agentArtwork} />
                  <span>PhenoLab Agent <span aria-hidden="true">+</span></span>
                </button>
                <div className={styles.featureList}>
                  {stage.features.slice(1).map((feature) => (
                    <WorkflowFeatureButton
                      key={feature.id}
                      feature={feature}
                      dialogId={dialogId}
                      onSelect={showFeature}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className={stage.id === 'collection' ? styles.collectionBody : undefined}>
                <div className={styles.featureList}>
                  {stage.features.map((feature) => (
                    <WorkflowFeatureButton
                      key={feature.id}
                      feature={feature}
                      dialogId={dialogId}
                      onSelect={showFeature}
                      caption={featureCaptions[feature.id]}
                      colorArtwork={stage.id === 'analysis'}
                      className={stage.id === 'analysis' ? styles.analysisFeature : styles.collectionFeature}
                    />
                  ))}
                </div>
                {stage.id === 'collection' ? (
                  <div className={styles.collectionIllustration} aria-hidden="true">
                    <WorkflowArtwork name="multimodal-collection-v3" color className={styles.collectionArtwork} />
                  </div>
                ) : null}
              </div>
            )}
          </section>
        ))}
      </div>

      <button
        type="button"
        className={styles.learning}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        onClick={() => showFeature(learning)}>
        <span className={styles.loop} aria-hidden="true">↻</span>
        <span>
          <strong>Continuous learning</strong>
          <span className={styles.learningCaption}>New data, analyses, expert feedback, and literature refine knowledge and workflows.</span>
        </span>
        <span aria-hidden="true">+</span>
      </button>

      <div className={styles.outcomes} role="group" aria-label="Research outputs">
        {outcomes.map((feature) => (
          <WorkflowFeatureButton
            key={feature.id}
            feature={feature}
            dialogId={dialogId}
            onSelect={showFeature}
            caption={featureCaptions[feature.id]}
            className={styles.outcome}
          />
        ))}
      </div>

      <dialog ref={dialogRef} id={dialogId} className={styles.dialog} aria-labelledby={dialogTitleId}>
        <div className={styles.detail}>
          <div className={styles.detailTop}>
            <p className={styles.eyebrow}>Inside PhenoLab</p>
            <button type="button" className={styles.close} aria-label="Close feature details" autoFocus onClick={() => dialogRef.current?.close()}>×</button>
          </div>
          <h2 id={dialogTitleId}>{selected.title}</h2>
          <p className={styles.description}>{selected.description}</p>
          <h3>What you can do</h3>
          <ul className={styles.capabilities}>
            {selected.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>
          <div className={styles.example}>
            <h3>Try this in your research</h3>
            <p>{selected.example}</p>
          </div>
          <Link
            className="button button--primary"
            to={selected.to}
            onClick={() => dialogRef.current?.close()}>
            Explore the documentation <span aria-hidden="true">→</span>
          </Link>
          <p className={styles.detailFooter}>Select another feature on the map to keep exploring.</p>
        </div>
      </dialog>
    </section>
  );
}
