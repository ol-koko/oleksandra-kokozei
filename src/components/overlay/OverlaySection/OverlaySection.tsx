import { LocationLabel } from '@/components/ui/LocationLabel/LocationLabel';
import type { OverlaySectionView } from '@/features/overlay/useOverlayView';
import styles from './OverlaySection.module.css';

type OverlaySectionProps = {
  section: OverlaySectionView;
};

/**
 * One overlay section: heading, optional caption (location or one line of
 * text), then the body. Bodies are placeholders until the content stages.
 * Focusable by script, so the overlay nav can move focus to the section.
 */
export function OverlaySection({ section }: OverlaySectionProps) {
  const headingId = `${section.anchorId}-heading`;
  const { caption } = section;

  return (
    <section
      id={section.anchorId}
      aria-labelledby={headingId}
      tabIndex={-1}
      className={styles.section}
    >
      <div className={styles.header}>
        <h2 id={headingId} className="text-title-l">
          {section.heading}
        </h2>
        {caption?.kind === 'location' && (
          <LocationLabel label={caption.text} className="animate-caption" />
        )}
        {caption?.kind === 'text' && (
          <p className={`${styles.caption} text-body-m animate-caption`}>{caption.text}</p>
        )}
      </div>

      <div className={styles.placeholder} aria-hidden="true" />
    </section>
  );
}
