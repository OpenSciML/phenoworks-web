import type {CSSProperties, ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

type WorkflowArtworkProps = {
  /** Extracted artwork filename, without its extension. */
  name: string;
  /** Keep the source colors rather than tinting its extracted glyph mask. */
  color?: boolean;
  className?: string;
};

/** Render an original diagram cutout or a theme-aware glyph from its alpha mask. */
export default function WorkflowArtwork({name, color = false, className = ''}: WorkflowArtworkProps): ReactNode {
  const src = useBaseUrl(`/img/workflow/${name}.png`);
  return color ? (
    <img className={`${styles.artwork} ${className}`} src={src} alt="" aria-hidden="true" />
  ) : (
    <span
      className={`${styles.glyph} ${className}`}
      style={{'--artwork-url': `url("${src}")`} as CSSProperties}
      aria-hidden="true"
    />
  );
}
