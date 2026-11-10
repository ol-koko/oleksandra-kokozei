import type { WorkSlug } from '@/content/types';
import { getWorkCase } from '@/content/workCases';

/** A phone-shaped app fits the desktop overlay from here. Keep in sync with Overlay.module.css. */
const PHONE_FRAME_QUERY = '(min-width: 768px)';
/** A landscape app needs the desktop layout's width (`--breakpoint-lg`). */
const DESKTOP_FRAME_QUERY = '(min-width: 1024px)';

/** The media query above which a work's live app opens in the overlay instead of a new tab. */
export function liveAppQuery(slug: WorkSlug | undefined) {
  const frame = slug && getWorkCase(slug)?.liveApp?.frame;
  return frame === 'desktop' ? DESKTOP_FRAME_QUERY : PHONE_FRAME_QUERY;
}
