'use client';

import type { ComponentProps } from 'react';
import type { OverlayRoute } from '@/content/types';
import { isPointerClick } from '@/features/focus/moveFocus';
import { Link } from '@/features/i18n/navigation';
import { overlayKey, overlayPath, rememberOpener } from '@/features/overlay/overlayRoute';

type OverlayTriggerProps = Omit<ComponentProps<typeof Link>, 'href' | 'onClick'> & {
  route: OverlayRoute;
};

/**
 * A link to an overlay's path (`/works/ces`). A plain click opens the overlay
 * over the page through the intercepting route, and focus returns here when
 * it closes; a modified click opens the path in a new tab as usual.
 */
export function OverlayTrigger({ route, children, ...props }: OverlayTriggerProps) {
  return (
    <Link
      {...props}
      href={overlayPath(route)}
      scroll={false}
      aria-haspopup="dialog"
      data-overlay-trigger={overlayKey(route)}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        rememberOpener(route, {
          trigger: event.currentTarget,
          fromPointer: isPointerClick(event),
        });
      }}
    >
      {children}
    </Link>
  );
}
