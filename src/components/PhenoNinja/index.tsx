import {useId, type ReactNode} from 'react';

import './styles.css';

export type PhenoNinjaState = 'idle' | 'thinking' | 'open';

type PhenoNinjaProps = {
  /** Which animation set to play. */
  state?: PhenoNinjaState;
  /** Rendered edge length in pixels. The artwork is square. */
  size?: number;
  /** Accessible name. Omit when a sibling label already names the control. */
  title?: string;
};

const STATE_CLASS: Record<PhenoNinjaState, string> = {
  idle: 'phenoninja--idle',
  thinking: 'phenoninja--thinking',
  open: 'phenoninja--open',
};

/**
 * Render PhenoNinja, the Ask PhenoWorks mascot.
 *
 * The artwork is a single inline SVG so it stays sharp at any size, recolours
 * with the theme, and animates through CSS classes rather than sprite frames.
 *
 * @param props - Animation state, rendered size, and optional accessible name.
 */
export default function PhenoNinja({
  state = 'idle',
  size = 48,
  title,
}: PhenoNinjaProps): ReactNode {
  const headClipId = `phenoninja-head-${useId()}`;

  return (
    <svg
      className={`phenoninja ${STATE_CLASS[state]}`}
      viewBox="0 0 48 48"
      width={size}
      height={size}
      focusable="false"
      shapeRendering="geometricPrecision"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      xmlns="http://www.w3.org/2000/svg">
      {title ? <title>{title}</title> : null}

      <defs>
        <clipPath id={headClipId}>
          <rect x="4" y="10" width="34" height="34" rx="15.5" />
        </clipPath>
      </defs>

      <g className="phenoninja__hop">
        {/* Thought dots, revealed only while the assistant is working. */}
        <g className="phenoninja__thoughts">
          <circle className="phenoninja__thought" cx="39.5" cy="8" r="2" />
          <circle className="phenoninja__thought" cx="43.4" cy="4.4" r="1.4" />
          <circle className="phenoninja__thought" cx="46" cy="1.7" r="0.9" />
        </g>

        <g className="phenoninja__bob">
          {/* Contact shadow, drawn as vector rather than a CSS filter: a filter
              plus a transform rasterises the whole mascot and softens it. */}
          <rect
            className="phenoninja__shadow"
            x="4"
            y="11.8"
            width="34"
            height="34"
            rx="15.5"
          />

          {/* Headband tails, anchored at the right temple. */}
          <path
            className="phenoninja__tail phenoninja__tail--upper"
            d="M36.6 18.8C40.5 17.2 42.5 20 46 18.6"
          />
          <path
            className="phenoninja__tail phenoninja__tail--lower"
            d="M36.6 22C39.5 23.8 41.5 25.8 44.5 25"
          />

          {/* Hood. */}
          <rect
            className="phenoninja__hood"
            x="4"
            y="10"
            width="34"
            height="34"
            rx="15.5"
          />

          <g clipPath={`url(#${headClipId})`}>
            {/* Headband across the forehead. */}
            <rect className="phenoninja__band" x="4" y="16.8" width="34" height="7.4" />
            {/* Eye slit. */}
            <rect className="phenoninja__slit" x="4" y="25.6" width="34" height="10.4" />
          </g>

          {/* Sprout emblem on the headband. */}
          <path
            className="phenoninja__leaf"
            d="M21 17.3C23.3 18.3 23.6 20.1 21 22.4C18.4 20.1 18.7 18.3 21 17.3Z"
          />

          <ellipse className="phenoninja__eye" cx="14.9" cy="30.7" rx="3.1" ry="3.7" />
          <ellipse className="phenoninja__eye" cx="27.8" cy="30.7" rx="3.1" ry="3.7" />

          {/* Hairline outline last, so it sits above the fills. */}
          <rect
            className="phenoninja__outline"
            x="4"
            y="10"
            width="34"
            height="34"
            rx="15.5"
          />
        </g>
      </g>
    </svg>
  );
}
