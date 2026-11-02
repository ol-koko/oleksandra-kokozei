import type { ReactNode } from 'react';
import styles from './Section.module.css';

type SectionProps = {
  /** Anchor of the section: the nav and the scroll-spy find it by this id. */
  id: string;
  title: string;
  /** Lines under the title. */
  intro?: readonly string[];
  /** Content follows the title directly (24), without blocks of its own (60). */
  compact?: boolean;
  /** Controls that belong to the title (the palette tabs), 16 below it. */
  headerContent?: ReactNode;
  children: ReactNode;
};

/** A top-level block of the page (Colors, Typography, ...): an `h2` and its content. */
export function Section({
  id,
  title,
  intro,
  compact = false,
  headerContent,
  children,
}: SectionProps) {
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className={`${styles.section} ${compact ? styles.compact : ''}`}>
      <header className={styles.header}>
        <h2 id={`${id}-title`} className={`${styles.title} text-title-l`}>
          {title}
        </h2>
        {intro && (
          <p className={`${styles.intro} text-body-l`}>
            {intro.map((line, index) => (
              <span key={line}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        )}
        {headerContent}
      </header>
      {children}
    </section>
  );
}

type SubsectionProps = {
  id?: string;
  title: string;
  children: ReactNode;
  /** Gray, as the "Body" and "Heading" labels in the scale. */
  muted?: boolean;
  /** `h4` for a block inside another block (Body, Heading inside Scale). */
  level?: 'h3' | 'h4';
};

/** A block inside a section (Family, Buttons, ...): an `h3` and its content. */
export function Subsection({
  id,
  title,
  children,
  muted = false,
  level: Heading = 'h3',
}: SubsectionProps) {
  const titleId = id ? `${id}-title` : undefined;

  return (
    <div id={id} tabIndex={id ? -1 : undefined} role="group" aria-labelledby={titleId} className={styles.subsection}>
      <Heading id={titleId} className={`${styles.subtitle} ${muted ? styles.muted : ''} text-title-s`}>
        {title}
      </Heading>
      {children}
    </div>
  );
}
