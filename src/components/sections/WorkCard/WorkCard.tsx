import { useTranslations } from 'next-intl';
import { LoopVideo } from '@/components/media/LoopVideo/LoopVideo';
import { OverlayTrigger } from '@/components/overlay/OverlayTrigger/OverlayTrigger';
import type { Work } from '@/content/types';
import styles from './WorkCard.module.css';

type WorkCardProps = {
  work: Work;
};

/**
 * Cover video with a "Title・Year" pill, then a one-line description (Figma 57:496).
 * The pill text is the card heading and holds the button that opens the work
 * overlay; the button's hit area stretches over the whole card. An unpublished
 * work shows the same card without the button and without hover motion.
 */
export function WorkCard({ work }: WorkCardProps) {
  const t = useTranslations('Works');
  const { cover } = work;
  const descriptionId = `work-${work.slug}-description`;
  const pill = (
    <span className={`${styles.pill} text-body-xs`}>
      {t('pill', { title: t(`items.${work.slug}.title`), year: work.year })}
    </span>
  );

  return (
    <article className={work.published ? `work-card ${styles.card}` : styles.card}>
      <div className={`work-cover ${styles.cover}`}>
        <LoopVideo video={cover.video} />
      </div>

      <h3 className={styles.title}>
        {work.published ? (
          <OverlayTrigger
            route={{ kind: 'work', slug: work.slug }}
            className={styles.button}
            aria-describedby={descriptionId}
          >
            {pill}
          </OverlayTrigger>
        ) : (
          pill
        )}
      </h3>

      <p id={descriptionId} className={`${styles.description} text-body-s`}>
        {t(`items.${work.slug}.description`)}
      </p>
    </article>
  );
}
