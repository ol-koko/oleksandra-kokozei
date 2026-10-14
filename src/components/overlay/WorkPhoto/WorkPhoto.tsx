import { useTranslations } from 'next-intl';
import { WorkMedia } from '@/components/overlay/WorkMedia/WorkMedia';
import type { WorkPhotoBlock } from '@/content/types';
import styles from './WorkPhoto.module.css';

type WorkPhotoProps = {
  block: WorkPhotoBlock;
};

/** A case study photo with its caption below (Figma "photo + subtitle", 472:671). */
export function WorkPhoto({ block }: WorkPhotoProps) {
  const t = useTranslations('WorkCases');

  return (
    <figure className={styles.photo}>
      <WorkMedia image={block.image} alt={t(`${block.copy}.alt`)} />
      <figcaption className={`${styles.caption} text-body-2xs`}>
        {t(`${block.copy}.caption`)}
      </figcaption>
    </figure>
  );
}
