'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { meOverlay, workOverlay } from '@/content/overlays';
import type { OverlayRoute, SectionId } from '@/content/types';
import { overlayKey, type OverlayKey } from './overlayRoute';

export type OverlaySectionView = {
  id: string;
  /** Element id inside the overlay, unique across overlays (`overlay-me-home`). */
  anchorId: string;
  navLabel: string;
  heading: string;
  caption?: { kind: 'location' | 'text'; text: string };
};

export type OverlayView = {
  key: OverlayKey;
  /** Accessible name of the dialog. */
  title: string;
  /** Last breadcrumb. */
  crumb: string;
  parentSection: SectionId;
  /** First breadcrumb: the page section the overlay closes back to. */
  parentLabel: string;
  sections: readonly OverlaySectionView[];
};

/**
 * Resolves an overlay's content data into the labels its shared component tree
 * renders. Section bodies are placeholders until the content stages.
 */
export function useOverlayView(route: OverlayRoute): OverlayView {
  const t = useTranslations('Overlay');
  const tMe = useTranslations('Me');
  const tWorks = useTranslations('Works');
  const tNav = useTranslations('Nav');

  return useMemo(() => {
    const key = overlayKey(route);
    const anchorId = (id: string) => `overlay-${key}-${id}`;
    const parentOf = (section: SectionId) => ({
      parentSection: section,
      parentLabel: tNav(section),
    });

    if (route.kind === 'me') {
      return {
        key,
        title: t('me.title'),
        crumb: t('me.crumb'),
        ...parentOf(meOverlay.parentSection),
        sections: meOverlay.sections.map((id): OverlaySectionView => {
          const base = { id, anchorId: anchorId(id), navLabel: t(`me.sections.${id}.nav`) };
          switch (id) {
            case 'about':
              return {
                ...base,
                heading: tMe('greeting'),
                caption: { kind: 'location', text: tMe('location') },
              };
            case 'home':
              return {
                ...base,
                heading: t('me.sections.home.heading'),
                caption: { kind: 'location', text: t('me.sections.home.caption') },
              };
            default:
              return { ...base, heading: t(`me.sections.${id}.heading`) };
          }
        }),
      };
    }

    const title = tWorks(`items.${route.slug}.title`);
    return {
      key,
      title,
      crumb: title,
      ...parentOf(workOverlay.parentSection),
      sections: workOverlay.sections.map((id): OverlaySectionView => {
        const base = { id, anchorId: anchorId(id), navLabel: t(`work.sections.${id}.nav`) };
        return id === 'about'
          ? {
              ...base,
              heading: title,
              caption: { kind: 'text', text: tWorks(`items.${route.slug}.description`) },
            }
          : { ...base, heading: t(`work.sections.${id}.heading`) };
      }),
    };
  }, [route, t, tMe, tWorks, tNav]);
}
