'use client';

import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';
import { ComponentCard } from '@/components/design-system/ComponentCard/ComponentCard';
import { Section, Subsection } from '@/components/design-system/Section/Section';
import { MenuToggleIcon } from '@/components/icons/MenuToggleIcon';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher/LanguageSwitcher';
import { SectionNav } from '@/components/navigation/SectionNav/SectionNav';
import { Breadcrumbs } from '@/components/overlay/Breadcrumbs/Breadcrumbs';
import { OverlayNav } from '@/components/overlay/OverlayNav/OverlayNav';
import { ArrowButton } from '@/components/overlay/Shelf/Shelf';
import { SocialLinks } from '@/components/social/SocialLinks/SocialLinks';
import { Divider } from '@/components/ui/Divider/Divider';
import { Pill } from '@/components/ui/Pill/Pill';
import { TextButton } from '@/components/ui/TextButton/TextButton';
import {
  componentGroups,
  componentLabels,
  componentsIntro,
  type ComponentSpecimenId,
} from '@/content/designSystem';
import type { SectionId } from '@/content/types';
import type { Locale } from '@/features/i18n/routing';
import type { OverlaySectionView } from '@/features/overlay/useOverlayView';
import styles from './ComponentsSection.module.css';

/** Items of the sidebar nav specimen (Figma 808:1135). */
const sidebarItems: readonly OverlaySectionView[] = ['About', 'Goal', 'Design', 'Result'].map(
  (label) => ({
    id: label.toLowerCase(),
    anchorId: label.toLowerCase(),
    navLabel: label,
    heading: label,
    body: { kind: 'work-blocks', blocks: [] },
  }),
);

const CAROUSEL_ITEMS = 3;

function MenuToggleSpecimen() {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      className={styles.menuToggle}
      aria-label="Menu toggle"
      aria-pressed={open}
      onClick={() => setOpen((value) => !value)}
    >
      <MenuToggleIcon open={open} />
    </button>
  );
}

function CarouselArrowsSpecimen() {
  const [index, setIndex] = useState(0);

  return (
    <div className={styles.arrows}>
      <ArrowButton
        label="Previous"
        direction="previous"
        disabled={index === 0}
        onClick={() => setIndex((value) => Math.max(0, value - 1))}
      />
      <ArrowButton
        label="Next"
        direction="next"
        disabled={index === CAROUSEL_ITEMS - 1}
        onClick={() => setIndex((value) => Math.min(CAROUSEL_ITEMS - 1, value + 1))}
      />
      <span className="visually-hidden" role="status">
        {`Item ${index + 1} of ${CAROUSEL_ITEMS}`}
      </span>
    </div>
  );
}

function TextButtonSpecimen() {
  const [expanded, setExpanded] = useState(false);

  return (
    <TextButton aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
      {expanded ? 'close' : 'more'}
    </TextButton>
  );
}

function NavBarSpecimen() {
  const [active, setActive] = useState<SectionId>('me');

  return (
    <SectionNav
      label="Nav bar"
      activeId={active}
      orientation="row"
      size="m"
      onSelect={setActive}
    />
  );
}

function SidebarNavSpecimen() {
  const [active, setActive] = useState(sidebarItems[0]?.anchorId);

  return (
    <div className={styles.sidebar}>
      <OverlayNav
        label="Sidebar nav"
        items={sidebarItems}
        activeId={active}
        onSelect={(anchorId) => setActive(anchorId)}
      />
    </div>
  );
}

function BreadcrumbsSpecimen() {
  return (
    <div className={styles.breadcrumbs}>
      <Breadcrumbs parentLabel="Works" current="FilmBudget" onExit={() => undefined} />
    </div>
  );
}

/** One social link: its tooltip shows on hover and keyboard focus only, as in the footer. */
function TooltipLabelSpecimen() {
  return <SocialLinks label="Tooltip label" order={['linkedin']} />;
}

function TagSpecimen() {
  const t = useTranslations('Works');

  return (
    <div className={styles.tags}>
      <Pill>{t('pill', { title: 'CES', year: 2026 })}</Pill>
      <Pill>{t('pill', { title: 'FilmBudget', year: 2025 })}</Pill>
    </div>
  );
}

function LanguagePillsSpecimen() {
  const [locale, setLocale] = useState<Locale>('en');

  return <LanguageSwitcher label="Language pills" preview={{ locale, onChange: setLocale }} />;
}

const specimens: Record<ComponentSpecimenId, ReactNode> = {
  'menu-toggle': <MenuToggleSpecimen />,
  'carousel-arrows': <CarouselArrowsSpecimen />,
  'text-button': <TextButtonSpecimen />,
  divider: <Divider className={styles.divider} />,
  'nav-bar': <NavBarSpecimen />,
  'sidebar-nav': <SidebarNavSpecimen />,
  breadcrumbs: <BreadcrumbsSpecimen />,
  'tooltip-label': <TooltipLabelSpecimen />,
  tag: <TagSpecimen />,
  'language-pills': <LanguagePillsSpecimen />,
};

/**
 * Components (Figma 808:1094): the real site components, live. The menu toggle
 * morphs, the arrows step through a strip, the nav and language pills keep
 * their hover, active state and slide but never leave the page.
 */
export function ComponentsSection() {
  return (
    <Section id="components" title="Components" intro={componentsIntro}>
      {componentGroups.map((group) => (
        <Subsection key={group.id} id={group.id} title={group.title}>
          <div className={styles.grid}>
            {group.items.map((item) => (
              <div key={item} className={item === 'divider' ? styles.wide : undefined}>
                <ComponentCard label={componentLabels[item]}>{specimens[item]}</ComponentCard>
              </div>
            ))}
          </div>
        </Subsection>
      ))}
    </Section>
  );
}
