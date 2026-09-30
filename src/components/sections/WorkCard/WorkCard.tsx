import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Work } from '@/content/types';
import styles from './WorkCard.module.css';

type WorkCardProps = {
  work: Work;
};

/** Cover with a "Title・Year" pill, then a one-line description (Figma 57:496). */
export function WorkCard({ work }: WorkCardProps) {
  const t = useTranslations('Works');
  const { cover } = work;
  const coverClass = [
    styles.cover,
    cover.background === 'placeholder' && styles.placeholder,
    cover.background === 'gradient' && styles.gradient,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    // TODO(overlay stage): make the card a button that opens the work overlay.
    <article className={styles.card}>
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

        <h3 className={`${styles.pill} text-body-xs`}>
          {t('pill', { title: t(`items.${work.slug}.title`), year: work.year })}
        </h3>
      </div>

      <p className={`${styles.description} text-body-s`}>{t(`items.${work.slug}.description`)}</p>
    </article>
  );
}
