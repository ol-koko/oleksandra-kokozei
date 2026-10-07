import { HometownPhotos } from '@/components/overlay/HometownPhotos/HometownPhotos';
import { OverlayAbout } from '@/components/overlay/OverlayAbout/OverlayAbout';
import { LocationLabel } from '@/components/ui/LocationLabel/LocationLabel';
import type { OverlaySectionView } from '@/features/overlay/useOverlayView';
import styles from './OverlaySection.module.css';

type OverlaySectionProps = {
  section: OverlaySectionView;
};

/**
 * One overlay section: heading, optional caption (location or one line of
 * text), then the body its kind names. The about intro brings its own heading.
 * Focusable by script, so the overlay nav can move focus to the section.
 */
export function OverlaySection({ section }: OverlaySectionProps) {
  const headingId = `${section.anchorId}-heading`;
  const { body, caption } = section;

  return (
    <section
      id={section.anchorId}
      aria-labelledby={headingId}
      tabIndex={-1}
      className={styles.section}
    >
      {body.kind === 'about-intro' ? (
        <OverlayAbout headingId={headingId} />
      ) : (
        <>
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

          {body.kind === 'hometown' && <HometownPhotos />}
          {body.kind === 'placeholder' && <div className={styles.placeholder} aria-hidden="true" />}
        </>
      )}
    </section>
  );
}
