'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useState, type ReactNode } from 'react';
import { AppOverlay } from '@/components/overlay/AppOverlay/AppOverlay';
import { Overlay } from '@/components/overlay/Overlay/Overlay';
import type { OverlayRoute } from '@/content/types';
import { useMediaQuery } from '@/features/motion/useMediaQuery';
import { isSameOverlay, overlayKey, parseAppOpen, parseOverlayRoute } from './overlayRoute';

/** The app overlay is desktop only; on mobile the live app opens in a new tab. */
const DESKTOP_QUERY = '(min-width: 768px)';

type OverlayHostProps = {
  /** The server-rendered site footer, repeated at the end of the mobile overlay. */
  footer: ReactNode;
};

/**
 * Renders the overlay the URL names (`?overlay=me`, `?work=<slug>`), so links
 * are shareable and a direct visit opens it. When the param goes away (Back,
 * Esc, backdrop, breadcrumb), the overlay stays mounted until its closing
 * motion has finished. On desktop, `&app=live` also opens the work's live app
 * in a second overlay above the case.
 */
export function OverlayHost({ footer }: OverlayHostProps) {
  const params = useSearchParams();
  const route = parseOverlayRoute(params);
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const app = desktop && parseAppOpen(params, route);
  const [shown, setShown] = useState<OverlayRoute | null>(route);
  const [appShown, setAppShown] = useState(app);

  // Derived state: show an overlay as soon as the URL names one.
  if (route && !isSameOverlay(route, shown)) setShown(route);
  if (app && !appShown) setAppShown(true);

  const onClosed = useCallback(() => setShown(null), []);
  const onAppClosed = useCallback(() => setAppShown(false), []);

  if (!shown) return null;

  return (
    <>
      <Overlay
        key={overlayKey(shown)}
        route={shown}
        open={isSameOverlay(route, shown)}
        onClosed={onClosed}
        footer={footer}
      />
      {appShown && shown.kind === 'work' && (
        <AppOverlay key={`app-${shown.slug}`} slug={shown.slug} open={app} onClosed={onAppClosed} />
      )}
    </>
  );
}
