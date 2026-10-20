import { workRouteParams } from '@/features/overlay/overlayRoute';

export const dynamicParams = false;

export function generateStaticParams() {
  return workRouteParams();
}

/**
 * `/works/<slug>` opened from the page: the intercepted route keeps the page
 * mounted. `OverlayHost` renders the overlay, so it can play its closing
 * motion after this route is gone.
 */
export default function WorkModal() {
  return null;
}
