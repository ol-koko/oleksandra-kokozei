import { LoadingImage } from '@/components/media/LoadingImage/LoadingImage';
import type { ImageAsset } from '@/content/types';
import styles from './VhsTape.module.css';

type VhsTapeProps = {
  poster: ImageAsset;
  /** Names the button: "Poster of <title> (<year>)". */
  alt: string;
  /** Open: the tape is out of its sleeve and the reels spin. */
  pressed: boolean;
  onToggle: () => void;
};

/**
 * The "VHS" brand on the tape: decorative artwork, the same in every locale.
 * Drawn as 5 × 7 pixel glyphs like the template's pixel font (VT323), so no
 * font has to load.
 */
const LABEL_GLYPHS = [
  ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'], // V
  ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'], // H
  ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'], // S
];
const GLYPH_WIDTH = 5;
const GLYPH_HEIGHT = 7;
/** Cells between letters: the template's 0.3em letter spacing. */
const GLYPH_GAP = 3;
const LABEL_WIDTH = LABEL_GLYPHS.length * (GLYPH_WIDTH + GLYPH_GAP) - GLYPH_GAP;

/** One square per lit cell. */
const LABEL_PATH = LABEL_GLYPHS.flatMap((rows, letter) =>
  rows.flatMap((row, y) =>
    [...row].flatMap((cell, x) =>
      cell === '#' ? [`M${letter * (GLYPH_WIDTH + GLYPH_GAP) + x} ${y}h1v1h-1z`] : [],
    ),
  ),
).join('');

/**
 * A film on VHS (template: reference/claude-design/films-vhs-template.html).
 * When open the tape slides out from under the poster sleeve and its reels
 * spin. A toggle button like `Book`: hover and keyboard focus preview the
 * open state, a press keeps it (aria-pressed).
 */
export function VhsTape({ poster, alt, pressed, onToggle }: VhsTapeProps) {
  return (
    <button type="button" className={styles.slot} aria-pressed={pressed} onClick={onToggle}>
      <span className={styles.vhs}>
        <span className={styles.tape}>
          <svg
            className={styles.brand}
            viewBox={`0 0 ${LABEL_WIDTH} ${GLYPH_HEIGHT}`}
            aria-hidden="true"
            focusable="false"
          >
            <path d={LABEL_PATH} />
          </svg>
          <span className={styles.window}>
            <span className={`${styles.reel} ${styles.reelTop}`} />
            <span className={`${styles.reel} ${styles.reelBottom}`} />
          </span>
          <span className={styles.label} />
        </span>
        <span className={styles.sleeve}>
          <LoadingImage image={poster} alt={alt} sizes="150px" />
        </span>
      </span>
    </button>
  );
}
