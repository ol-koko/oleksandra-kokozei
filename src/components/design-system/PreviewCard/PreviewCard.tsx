import type { ReactNode } from 'react';
import styles from './PreviewCard.module.css';

type PreviewCardProps = {
  /** Name under the tile (`fadeIn`, `radius-xs`). */
  title: string;
  caption: string;
  /** The `</>` glyph's content: the class or token the specimen shows. Read by screen readers. */
  code: string;
  /** Which element is the stage (the ref target, loops). */
  children: ReactNode;
  className?: string;
};

/**
 * A documentation card (Figma 752:2701): a 160 px gray tile with the specimen
 * and a `</>` mark, then the name and what it is for. The mark carries the
 * class or token in its title and in text for screen readers.
 */
export function PreviewCard({ title, caption, code, children, className }: PreviewCardProps) {
  return (
    <figure className={`${styles.card} ${className ?? ''}`}>
      <div className={styles.preview}>
        <span className={`${styles.code} text-body-xs`} title={code} aria-hidden="true">
          {'</>'}
        </span>
        {children}
      </div>
      <figcaption className={styles.caption}>
        <span className={`${styles.title} text-title-s`}>{title}</span>
        <span className={`${styles.note} text-body-xs`}>{caption}</span>
        <span className="visually-hidden">Code: {code}</span>
      </figcaption>
    </figure>
  );
}
