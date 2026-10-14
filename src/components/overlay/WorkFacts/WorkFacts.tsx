import { useTranslations } from 'next-intl';
import type { WorkFact } from '@/content/types';
import styles from './WorkFacts.module.css';

type WorkFactsProps = {
  facts: readonly WorkFact[];
  year: number;
};

/** Label/value pairs in the case header (Figma "txt-works-badges", 448:546). */
export function WorkFacts({ facts, year }: WorkFactsProps) {
  const t = useTranslations('Overlay.work.facts');
  const tCases = useTranslations('WorkCases');

  return (
    <dl className={styles.facts}>
      {facts.map((fact) => (
        <div key={fact.id} className={styles.fact}>
          <dt className={`${styles.label} text-title-m`}>{t(fact.id)}</dt>
          <dd className="text-body-l">{fact.id === 'year' ? year : tCases(fact.value)}</dd>
        </div>
      ))}
    </dl>
  );
}
