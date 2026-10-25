import type { ReactNode } from 'react';
import styles from './ComponentCard.module.css';

type ComponentCardProps = {
  /** Lowercase name next to the mark (`menu toggle`). */
  label: string;
  children: ReactNode;
  /** The empty legend tile of Materials: it only explains the dashed frame. */
  legend?: boolean;
};

/** The four-diamond component mark of Figma's component labels (808:1215). */
function ComponentMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 20.27 20.04" aria-hidden="true" focusable="false">
      <path d="M10.02 0L14.72 4.7L10.02 9.4L5.32 4.7ZM10.02 10.64L14.72 15.34L10.02 20.04L5.32 15.34ZM4.7 5.32L9.4 10.02L4.7 14.72L0 10.02ZM15.56 5.32L20.27 10.02L15.56 14.72L10.86 10.02Z" />
    </svg>
  );
}

/**
 * A live instance of a site component, in Figma's component frame (808:1101):
 * a violet label above a dashed tile. The violet is Figma's own annotation
 * color, local to this page and not a design token.
 */
export function ComponentCard({ label, children, legend = false }: ComponentCardProps) {
  return (
    <figure className={styles.card}>
      <figcaption className={styles.label}>
        <ComponentMark />
        <span className="text-body-m">{label}</span>
      </figcaption>
      <div className={`${styles.tile} ${legend ? styles.legend : ''}`}>{children}</div>
    </figure>
  );
}
