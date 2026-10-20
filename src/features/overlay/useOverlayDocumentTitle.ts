'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import type { OverlayRoute } from '@/content/types';

/**
 * Keeps the tab title in step with the open overlay, as in its metadata
 * (`overlayMetadata`). A direct visit gets the title from the server, but
 * opening through the intercepting `@modal` routes does not update metadata,
 * and closing returns to the page path in place.
 */
export function useOverlayDocumentTitle(route: OverlayRoute | null) {
  const t = useTranslations();
  const title = route
    ? t('Metadata.pageTitle', {
        title: route.kind === 'me' ? t('Overlay.me.title') : t(`Works.items.${route.slug}.title`),
      })
    : t('Metadata.title');

  useEffect(() => {
    document.title = title;
  }, [title]);
}
