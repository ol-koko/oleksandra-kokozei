'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Logo } from '@/components/layout/Logo/Logo';
import { MobileMenu } from '@/components/layout/MobileMenu/MobileMenu';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher/LanguageSwitcher';
import { SectionNav } from '@/components/navigation/SectionNav/SectionNav';
import { isStandalonePath, sectionIds } from '@/content/navigation';
import { usePathname } from '@/features/i18n/navigation';
import { useScrollSpy } from '@/features/scroll-spy/useScrollSpy';
import { useSectionLinks } from '@/features/section-links/useSectionLinks';
import styles from './SiteHeader.module.css';

/**
 * The site header, except on a page of its own (the design system page brings
 * its own top bar, the breadcrumbs). The choice is a component that renders or
 * does not, never a hook that runs or does not: `SiteHeaderBar` owns every
 * other hook, so the hook order of each component is the same on every route.
 */
export function SiteHeader() {
  const standalone = isStandalonePath(usePathname());
  if (standalone) return null;
  return <SiteHeaderBar />;
}

/**
 * Sticky page header. Desktop (≥ 1024): logo, section nav, language chips.
 * Below 1024: logo and the mobile menu button.
 */
function SiteHeaderBar() {
  const t = useTranslations('Header');
  const headerRef = useRef<HTMLElement>(null);
  const activeId = useScrollSpy(sectionIds, headerRef);
  useSectionLinks();

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.brand}>
        <Logo animation="header" />
      </div>
      <SectionNav
        label={t('mainNav')}
        activeId={activeId}
        orientation="row"
        size="m"
        className={styles.desktopOnly}
      />
      <LanguageSwitcher
        label={t('languageNav')}
        activeId={activeId}
        className={`${styles.languages} ${styles.desktopOnly}`}
      />
      <MobileMenu activeId={activeId} />
    </header>
  );
}
