import type { ReactNode } from 'react';
import { CodeButton } from '@/components/design-system/CodeButton/CodeButton';
import styles from './PreviewCard.module.css';

type PreviewCardProps = {
  /** Name under the tile (`fadeIn`, `radius-xs`). */
  title: string;
  caption: string;
  /** The CSS of the specimen: what its `</>` button copies. */
  css: string;
  /** The specimen. */
  children: ReactNode;
  className?: string;
};

/**
 * A documentation card (Figma 752:2701): a 160 px gray tile with the specimen
 * and a `</>` button that copies its CSS, then the name and what it is for.
 */
export function PreviewCard({ title, caption, css, children, className }: PreviewCardProps) {
  return (
    <figure className={`${styles.card} ${className ?? ''}`} data-reveal>
      <div className={styles.preview}>
        <span className={styles.code}>
          <CodeButton css={css} label={title} />
        </span>
        {children}
      </div>
      <figcaption className={styles.caption}>
        <span className={`${styles.title} text-title-s`}>{title}</span>
        <span className={`${styles.note} text-body-xs`}>{caption}</span>
      </figcaption>
    </figure>
  );
}
