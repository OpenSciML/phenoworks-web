import {useId, type ReactNode} from 'react';

import './styles.css';

export type PhenoNinjaState = 'idle' | 'thinking' | 'open';

/**
 * How much of the mascot to show.
 *
 * - `full` — head and torso. Needs roughly 110px of height before the face
 *   reads clearly, so it suits the floating chat trigger.
 * - `head` — the same artwork behind a tighter viewBox. For small inline uses
 *   such as the chat's loading row, where a whole body would be a smudge.
 */
export type PhenoNinjaVariant = 'full' | 'head';

type PhenoNinjaProps = {
  /** Which animation set to play. */
  state?: PhenoNinjaState;
  /** Rendered HEIGHT in pixels. Width follows the artwork's aspect ratio. */
  size?: number;
  /** How much of the figure to show. */
  variant?: PhenoNinjaVariant;
  /** Accessible name. Omit when a sibling label already names the control. */
  title?: string;
};

const STATE_CLASS: Record<PhenoNinjaState, string> = {
  idle: 'phenoninja--idle',
  thinking: 'phenoninja--thinking',
  open: 'phenoninja--open',
};

/** viewBox and aspect ratio per variant. The artwork itself never changes. */
const VIEWBOX: Record<PhenoNinjaVariant, {box: string; ratio: number}> = {
  full: {box: '0 0 64 72', ratio: 64 / 72},
  head: {box: '13 2 48 42', ratio: 48 / 42},
};

/**
 * Torso outline: sloped shoulders into a slightly barrelled body.
 *
 * A path rather than a rounded rectangle — the shoulder slope is most of what
 * makes the figure read as drawn rather than assembled from boxes.
 */
const TORSO =
  'M32 38C25.5 38 20.2 40.7 18.6 45.4C17.2 49.7 16.9 58.4 17.6 63.6' +
  'C18.1 67.2 20.2 69 24 69H40C43.8 69 45.9 67.2 46.4 63.6' +
  'C47.1 58.4 46.8 49.7 45.4 45.4C43.8 40.7 38.5 38 32 38Z';

/**
 * Render PhenoNinja, the Ask PhenoWorks mascot.
 *
 * A single inline SVG rather than a sprite sheet, so it stays sharp at any
 * size, recolours with the theme through CSS variables, and changes pose by
 * class rather than by frame maths.
 *
 * @param props - Animation state, rendered height, variant, accessible name.
 */
export default function PhenoNinja({
  state = 'idle',
  size = 130,
  variant = 'full',
  title,
}: PhenoNinjaProps): ReactNode {
  const uid = useId();
  const clipId = `pn-head-${uid}`;
  const hoodGradient = `pn-hood-${uid}`;
  const jacketGradient = `pn-jacket-${uid}`;
  const {box, ratio} = VIEWBOX[variant];

  return (
    <svg
      className={`phenoninja phenoninja--${variant} ${STATE_CLASS[state]}`}
      viewBox={box}
      height={size}
      width={Math.round(size * ratio)}
      focusable="false"
      shapeRendering="geometricPrecision"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      xmlns="http://www.w3.org/2000/svg">
      {title ? <title>{title}</title> : null}

      <defs>
        <clipPath id={clipId}>
          <rect x="15" y="6" width="34" height="34" rx="16" />
        </clipPath>

        {/* Stops are coloured from CSS so the theme variables still drive the
            palette; a flat fill is what made the earlier pass look printed. */}
        <linearGradient id={hoodGradient} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop className="phenoninja__stop--hoodTop" offset="0" />
          <stop className="phenoninja__stop--hoodBottom" offset="1" />
        </linearGradient>
        <linearGradient id={jacketGradient} x1="0.25" y1="0" x2="0.75" y2="1">
          <stop className="phenoninja__stop--jacketTop" offset="0" />
          <stop className="phenoninja__stop--jacketBottom" offset="1" />
        </linearGradient>
      </defs>

      <g className="phenoninja__hop">
        {/* Thought dots, revealed only while the assistant is working. */}
        <g className="phenoninja__thoughts">
          <circle className="phenoninja__thought" cx="51.5" cy="4" r="2" />
          <circle className="phenoninja__thought" cx="55.4" cy="1.6" r="1.4" />
        </g>

        <g className="phenoninja__bob">
          {/* Contact shadow, drawn as vector: a CSS filter plus a transform
              rasterises the whole mascot and visibly softens it. */}
          <g className="phenoninja__shadow" transform="translate(0 1.7)">
            <rect x="15" y="6" width="34" height="34" rx="16" />
            <path d={TORSO} />
          </g>

          {/* Headband tails, anchored at the right temple. */}
          <path
            className="phenoninja__tail phenoninja__tail--upper"
            d="M47.5 14.8C52.5 12.4 55.8 16.5 60.8 13.9"
          />
          <path
            className="phenoninja__tail phenoninja__tail--lower"
            d="M47.5 18.2C51.8 19.8 54.2 22.6 58.4 21.2"
          />

          {/* Arms first, so the torso covers where they meet the shoulder.
              Each rests a few degrees off vertical — perfectly upright limbs
              are the other half of what makes a figure look mechanical. */}
          <g className="phenoninja__arm phenoninja__arm--wave">
            <rect
              className="phenoninja__sleeve"
              x="11"
              y="42"
              width="8.6"
              height="19"
              rx="4.3"
              fill={`url(#${jacketGradient})`}
            />
            <rect
              className="phenoninja__cuff"
              x="11"
              y="53.4"
              width="8.6"
              height="5.8"
              rx="2.9"
            />
            <ellipse className="phenoninja__glove" cx="15.3" cy="62.2" rx="4.4" ry="4.1" />
          </g>

          <g className="phenoninja__arm phenoninja__arm--rest">
            <rect
              className="phenoninja__sleeve"
              x="44.4"
              y="42"
              width="8.6"
              height="19"
              rx="4.3"
              fill={`url(#${jacketGradient})`}
            />
            <path className="phenoninja__stripe" d="M47.6 46.4h4.2M47.6 49.2h4.2" />
            <rect
              className="phenoninja__cuff"
              x="44.4"
              y="53.4"
              width="8.6"
              height="5.8"
              rx="2.9"
            />
            <ellipse className="phenoninja__glove" cx="48.7" cy="62.2" rx="4.4" ry="4.1" />
          </g>

          {/* Collar, then torso. */}
          <rect className="phenoninja__collar" x="24.5" y="34.5" width="15" height="8.5" rx="4.2" />
          <path
            className="phenoninja__jacket"
            d={TORSO}
            fill={`url(#${jacketGradient})`}
          />

          {/* Open jacket front: a lapel line either side of the zip reads as
              cloth, where a single centre line reads as a seam on a shell. */}
          <path className="phenoninja__lapel" d="M28.6 39.6C29.4 45 30.6 50 31.9 55" />
          <path className="phenoninja__lapel" d="M35.4 39.6C34.6 45 33.4 50 32.1 55" />
          <path className="phenoninja__zip" d="M32 43.4V66" />
          <circle className="phenoninja__zipPull" cx="32" cy="61.5" r="1.15" />

          {/* Chest emblem: the PhenoWorks mark — sprout over data layers, in
              the logo's own teal, blue and olive. */}
          <g className="phenoninja__emblem">
            <path
              className="phenoninja__emblemLeafTeal"
              d="M32.2 54.4C33.1 51.6 35.3 50.2 37.2 50.2C37.3 52.6 35.5 54.4 32.2 54.4Z"
            />
            <path
              className="phenoninja__emblemLeafOlive"
              d="M31.5 54.4C30.7 52.5 29.2 51.5 27.9 51.5C27.8 53.2 29.1 54.4 31.5 54.4Z"
            />
            <path className="phenoninja__emblemStem" d="M32 54.4C32 51.6 32.4 49.8 33 48.7" />
            <circle className="phenoninja__emblemBud" cx="33.3" cy="48.1" r="0.85" />
            <rect className="phenoninja__emblemSlabTop" x="28.2" y="55.2" width="7.6" height="2" rx="1" />
            <rect className="phenoninja__emblemSlabBase" x="26.6" y="57.7" width="10.8" height="2.2" rx="1.1" />
          </g>

          {/* Hood, drawn over the collar so the head sits in front. */}
          <rect
            className="phenoninja__hood"
            x="15"
            y="6"
            width="34"
            height="34"
            rx="16"
            fill={`url(#${hoodGradient})`}
          />

          <g clipPath={`url(#${clipId})`}>
            <rect className="phenoninja__band" x="15" y="12.8" width="34" height="7.4" />
            {/* A sliver under the headband, so the band sits on the hood
                rather than being painted onto it. */}
            <rect className="phenoninja__bandShade" x="15" y="20.2" width="34" height="1.1" />
            <rect className="phenoninja__slit" x="15" y="21.6" width="34" height="10.4" />
            {/* Cheek shading down the right of the face. */}
            <path className="phenoninja__cheek" d="M49 21.6H41.4C43 25.6 43 28.4 41.4 32H49Z" />
          </g>

          {/* Sprout emblem on the headband. */}
          <path
            className="phenoninja__leaf"
            d="M32 13.3C34.3 14.3 34.6 16.1 32 18.4C29.4 16.1 29.7 14.3 32 13.3Z"
          />

          <ellipse className="phenoninja__eye" cx="25.6" cy="26.7" rx="3.1" ry="3.7" />
          <ellipse className="phenoninja__eye" cx="38.4" cy="26.7" rx="3.1" ry="3.7" />

          {/* Hairline outline last, so it sits above the fills. */}
          <rect className="phenoninja__outline" x="15" y="6" width="34" height="34" rx="16" />
        </g>
      </g>
    </svg>
  );
}
