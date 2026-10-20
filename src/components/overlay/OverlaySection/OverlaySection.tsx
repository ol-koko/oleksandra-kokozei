import { HometownPhotos } from '@/components/overlay/HometownPhotos/HometownPhotos';
import { OverlayAbout } from '@/components/overlay/OverlayAbout/OverlayAbout';
import { OverlayBooks } from '@/components/overlay/OverlayBooks/OverlayBooks';
import { OverlayFilms } from '@/components/overlay/OverlayFilms/OverlayFilms';
import { OverlaySongs } from '@/components/overlay/OverlaySongs/OverlaySongs';
import { WorkBlocks } from '@/components/overlay/WorkBlocks/WorkBlocks';
import { WorkIntro } from '@/components/overlay/WorkIntro/WorkIntro';
import { LocationLabel } from '@/components/ui/LocationLabel/LocationLabel';
import type { OverlaySectionView } from '@/features/overlay/useOverlayView';
import styles from './OverlaySection.module.css';

type OverlaySectionProps = {
  section: OverlaySectionView;
};

/**
 * One overlay section: heading, optional caption (location or one line of
 * text), then the body its kind names. The about intro and the work case
 * bodies bring their own heading. Focusable by script, so the overlay nav can
 * move focus to the section.
 *
 * Header and body reveal on scroll (`.reveal`). The intros are the first
 * screen and come in with the panel, so they do not; case blocks reveal one
 * by one (`WorkBlocks`). The section itself never moves: the nav measures it.
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
      ) : body.kind === 'work-intro' ? (
        <WorkIntro slug={body.slug} workCase={body.workCase} headingId={headingId} />
      ) : body.kind === 'work-blocks' ? (
        <WorkBlocks blocks={body.blocks} headingLevel={2} headingId={headingId} />
      ) : (
        <>
          <div className={`${styles.header} reveal`}>
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

          <div className="reveal">
            {body.kind === 'hometown' && <HometownPhotos />}
            {body.kind === 'songs' && <OverlaySongs />}
            {body.kind === 'books' && <OverlayBooks />}
            {body.kind === 'films' && <OverlayFilms />}
          </div>
        </>
      )}
    </section>
  );
}
