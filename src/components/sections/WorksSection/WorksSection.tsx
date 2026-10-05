import { useTranslations } from 'next-intl';
import { WorkCard } from '@/components/sections/WorkCard/WorkCard';
import { works } from '@/content/works';
import styles from './WorksSection.module.css';

const HEADING_ID = 'works-heading';

/** Section `#works` (Figma: desktop 21:247, mobile 245:686). */
export function WorksSection() {
  const t = useTranslations('Works');

  return (
    <section id="works" aria-labelledby={HEADING_ID} className={styles.works}>
      <h2 id={HEADING_ID} className="text-title-l reveal">
        {t('heading')}
      </h2>

      <ul className={styles.grid}>
        {works.map((work) => (
          <li key={work.slug} className={`${styles.item} reveal`}>
            <WorkCard work={work} />
          </li>
        ))}
      </ul>
    </section>
  );
}
