import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { OverlayTrigger } from '@/components/overlay/OverlayTrigger/OverlayTrigger';
import type { Work } from '@/content/types';
import styles from './WorkCard.module.css';

type WorkCardProps = {
  work: Work;
};

/**
 * Cover with a "Title・Year" pill, then a one-line description (Figma 57:496).
 * The pill text is the card heading and holds the button that opens the work
 * overlay; the button's hit area stretches over the whole card.
 */
export function WorkCard({ work }: WorkCardProps) {
  const t = useTranslations('Works');
  const { cover } = work;
  const descriptionId = `work-${work.slug}-description`;
  const coverClass = [
    'work-cover',
    styles.cover,
    cover.background === 'placeholder' && styles.placeholder,
    cover.background === 'gradient' && styles.gradient,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={`work-card ${styles.card}`}>
      <div className={coverClass}>
        {cover.fit === 'photo' ? (
          <Image
            className={styles.photo}
            src={cover.image.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 486px, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <Image
            className={styles.mockup}
            src={cover.image.src}
            alt=""
            width={cover.image.width}
            height={cover.image.height}
            sizes="(min-width: 1024px) 142px, 30vw"
          />
        )}

        {cover.logo && (
          <Image
            className={`${styles.logo} ${styles[cover.logo.placement]}`}
            src={cover.logo.src}
            alt=""
            width={cover.logo.width}
            height={cover.logo.height}
          />
        )}
      </div>

      <h3 className={styles.title}>
        <OverlayTrigger
          route={{ kind: 'work', slug: work.slug }}
          className={styles.button}
          aria-describedby={descriptionId}
        >
          <span className={`${styles.pill} text-body-xs`}>
            {t('pill', { title: t(`items.${work.slug}.title`), year: work.year })}
          </span>
        </OverlayTrigger>
      </h3>

      <p id={descriptionId} className={`${styles.description} text-body-s`}>
        {t(`items.${work.slug}.description`)}
      </p>
    </article>
  );
}
