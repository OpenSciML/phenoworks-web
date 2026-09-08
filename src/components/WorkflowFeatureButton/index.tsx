import type {ReactNode} from 'react';
import WorkflowArtwork from '../WorkflowArtwork';
import type {WorkflowFeature} from '../ScientificWorkflow/features';
import styles from './styles.module.css';

type WorkflowFeatureButtonProps = {
  feature: WorkflowFeature;
  dialogId: string;
  onSelect: (feature: WorkflowFeature) => void;
  caption?: string;
  colorArtwork?: boolean;
  className?: string;
};

/** Render a selectable capability with its extracted artwork and real text. */
export default function WorkflowFeatureButton({
  feature, dialogId, onSelect, caption, colorArtwork = false, className = '',
}: WorkflowFeatureButtonProps): ReactNode {
  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      aria-haspopup="dialog"
      aria-controls={dialogId}
      onClick={() => onSelect(feature)}>
      <WorkflowArtwork name={feature.id} color={colorArtwork} />
      <span className={styles.copy}>
        <span className={styles.title}>{feature.title}</span>
        {caption ? <span className={styles.caption}>{caption}</span> : null}
      </span>
      <span className={styles.more} aria-hidden="true">+</span>
    </button>
  );
}
