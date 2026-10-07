'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { meOverlay, workOverlay } from '@/content/overlays';
import type { OverlayRoute, SectionId } from '@/content/types';
import { overlayKey, type OverlayKey } from './overlayRoute';

/** What a section renders below its heading; new content plugs in as a new kind. */
export type OverlaySectionBody =
  | { kind: 'about-intro' } // overlay-me: greeting, location and bio with the polaroid
  | { kind: 'hometown' } // overlay-me: hometown photos
  | { kind: 'placeholder' }; // not built yet

export type OverlaySectionView = {
  id: string;
  /** Element id inside the overlay, unique across overlays (`overlay-me-home`). */
  anchorId: string;
  navLabel: string;
  heading: string;
  caption?: { kind: 'location' | 'text'; text: string };
  body: OverlaySectionBody;
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
 * renders. Sections without content yet get a placeholder body.
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
                body: { kind: 'about-intro' },
              };
            case 'home':
              return {
                ...base,
                heading: t('me.sections.home.heading'),
                caption: { kind: 'location', text: t('me.sections.home.caption') },
                body: { kind: 'hometown' },
              };
            default:
              return {
                ...base,
                heading: t(`me.sections.${id}.heading`),
                body: { kind: 'placeholder' },
              };
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
              body: { kind: 'placeholder' },
            }
          : {
              ...base,
              heading: t(`work.sections.${id}.heading`),
              body: { kind: 'placeholder' },
            };
      }),
    };
  }, [route, t, tMe, tWorks, tNav]);
}
