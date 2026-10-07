'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useState, type ReactNode } from 'react';
import { Overlay } from '@/components/overlay/Overlay/Overlay';
import type { OverlayRoute } from '@/content/types';
import { isSameOverlay, overlayKey, parseOverlayRoute } from './overlayRoute';

type OverlayHostProps = {
  /** The server-rendered site footer, repeated at the end of the mobile overlay. */
  footer: ReactNode;
};

/**
 * Renders the overlay the URL names (`?overlay=me`, `?work=<slug>`), so links
 * are shareable and a direct visit opens it. When the param goes away (Back,
 * Esc, backdrop, breadcrumb), the overlay stays mounted until its closing
 * motion has finished.
 */
export function OverlayHost({ footer }: OverlayHostProps) {
  const route = parseOverlayRoute(useSearchParams());
  const [shown, setShown] = useState<OverlayRoute | null>(route);

  // Derived state: show the overlay as soon as the URL names one.
  if (route && !isSameOverlay(route, shown)) setShown(route);

  const onClosed = useCallback(() => setShown(null), []);

  if (!shown) return null;

  return (
    <Overlay
      key={overlayKey(shown)}
      route={shown}
      open={isSameOverlay(route, shown)}
      onClosed={onClosed}
      footer={footer}
    />
  );
}
