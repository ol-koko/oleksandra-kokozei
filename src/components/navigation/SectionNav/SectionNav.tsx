'use client';

import { useLocale, useTranslations } from 'next-intl';
import { isStandalonePath, sectionIds } from '@/content/navigation';
import type { SectionId } from '@/content/types';
import { getPathname, usePathname } from '@/features/i18n/navigation';
import type { Locale } from '@/features/i18n/routing';
import styles from './SectionNav.module.css';

type SectionNavProps = {
  label: string;
  activeId?: SectionId;
  /** `responsive`: a column below 1024 px, a row from 1024 px (footer). */
  orientation: 'row' | 'column' | 'responsive';
  size: 'm' | 'l';
  onNavigate?: () => void;
  /**
   * Documentation specimen: a click picks the item here instead of scrolling
   * to the section, and the page never moves.
   */
  onSelect?: (id: SectionId) => void;
  className?: string;
};

/** Anchor links to the page sections (Me, Works, Experience). */
export function SectionNav({
  label,
  activeId,
  orientation,
  size,
  onNavigate,
  onSelect,
  className,
}: SectionNavProps) {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
  // On a page without the sections (/design-system) the links lead to them on the home page.
  const homePath = isStandalonePath(pathname)
    ? getPathname({ href: '/', locale: locale as Locale })
    : '';
  const textClass = size === 'l' ? 'text-title-l' : 'text-body-m';

  return (
    <nav aria-label={label} className={className}>
      <ul className={`${styles.list} ${styles[orientation]} ${styles[`size-${size}`]}`}>
        {sectionIds.map((id) => (
          <li key={id}>
            <a
              href={`${homePath}#${id}`}
              className={`nav-link ${styles.link} ${textClass}`}
              aria-current={id === activeId ? 'true' : undefined}
              onClick={(event) => {
                if (onSelect) {
                  event.preventDefault();
                  onSelect(id);
                }
                onNavigate?.();
              }}
            >
              {t(id)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
