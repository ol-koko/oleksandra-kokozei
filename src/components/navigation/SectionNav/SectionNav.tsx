'use client';

import { useTranslations } from 'next-intl';
import { sectionIds } from '@/content/navigation';
import type { SectionId } from '@/content/types';
import styles from './SectionNav.module.css';

type SectionNavProps = {
  label: string;
  activeId?: SectionId;
  /** `responsive`: a column below 1024 px, a row from 1024 px (footer). */
  orientation: 'row' | 'column' | 'responsive';
  size: 'm' | 'l';
  onNavigate?: () => void;
  className?: string;
};

/** Anchor links to the page sections (Me, Works, Experience). */
export function SectionNav({
  label,
  activeId,
  orientation,
  size,
  onNavigate,
  className,
}: SectionNavProps) {
  const t = useTranslations('Nav');
  const textClass = size === 'l' ? 'text-title-l' : 'text-body-m';

  return (
    <nav aria-label={label} className={className}>
      <ul className={`${styles.list} ${styles[orientation]} ${styles[`size-${size}`]}`}>
        {sectionIds.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`nav-link ${styles.link} ${textClass}`}
              aria-current={id === activeId ? 'true' : undefined}
              onClick={onNavigate}
            >
              {t(id)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
