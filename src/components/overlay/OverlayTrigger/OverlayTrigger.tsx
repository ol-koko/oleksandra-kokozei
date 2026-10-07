'use client';

import type { ComponentProps } from 'react';
import type { OverlayRoute } from '@/content/types';
import { isPointerClick } from '@/features/focus/moveFocus';
import { openOverlay, overlayKey } from '@/features/overlay/overlayRoute';

type OverlayTriggerProps = Omit<ComponentProps<'button'>, 'type' | 'onClick'> & {
  route: OverlayRoute;
};

/** A button that opens an overlay. Focus returns to it when the overlay closes. */
export function OverlayTrigger({ route, children, ...props }: OverlayTriggerProps) {
  return (
    <button
      {...props}
      type="button"
      aria-haspopup="dialog"
      data-overlay-trigger={overlayKey(route)}
      onClick={(event) =>
        openOverlay(route, { trigger: event.currentTarget, fromPointer: isPointerClick(event) })
      }
    >
      {children}
    </button>
  );
}
