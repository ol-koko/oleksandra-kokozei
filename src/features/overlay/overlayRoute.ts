import { workUrlSlugs } from '@/content/overlays';
import type { OverlayRoute, WorkSlug } from '@/content/types';

/** `?overlay=me` opens overlay-me. */
const OVERLAY_PARAM = 'overlay';
/** `?work=<url slug>` opens a work overlay. */
const WORK_PARAM = 'work';
/** Marks history entries pushed by `openOverlay`, so closing can step back over them. */
const ENTRY_FLAG = '__overlayEntry';

/** Stable id of an overlay, used for keys, anchors and trigger lookup. */
export type OverlayKey = 'me' | `work-${WorkSlug}`;

export function overlayKey(route: OverlayRoute): OverlayKey {
  return route.kind === 'me' ? 'me' : `work-${route.slug}`;
}

export function isSameOverlay(a: OverlayRoute | null, b: OverlayRoute | null) {
  return a !== null && b !== null && overlayKey(a) === overlayKey(b);
}

/** Reads the overlay from the query string. Unknown values open nothing. */
export function parseOverlayRoute(params: Pick<URLSearchParams, 'get'>): OverlayRoute | null {
  if (params.get(OVERLAY_PARAM) === 'me') return { kind: 'me' };

  const workParam = params.get(WORK_PARAM);
  const slug = (Object.keys(workUrlSlugs) as WorkSlug[]).find(
    (key) => workUrlSlugs[key] === workParam,
  );
  return slug ? { kind: 'work', slug } : null;
}

function urlFor(route: OverlayRoute | null) {
  const url = new URL(window.location.href);
  url.searchParams.delete(OVERLAY_PARAM);
  url.searchParams.delete(WORK_PARAM);
  url.hash = '';
  if (route?.kind === 'me') url.searchParams.set(OVERLAY_PARAM, 'me');
  if (route?.kind === 'work') url.searchParams.set(WORK_PARAM, workUrlSlugs[route.slug]);
  return url;
}

type Opener = {
  /** The button that opened the overlay; focus returns to it on close. */
  trigger: HTMLElement | null;
  fromPointer: boolean;
};

let opener: Opener = { trigger: null, fromPointer: false };

/** The last opener. After a direct visit there is none, and focus moves as for the keyboard. */
export function getOpener() {
  return opener;
}

/**
 * Opens an overlay by pushing its query param. Next.js syncs native
 * `pushState` with `useSearchParams`, so the overlay host renders it, and
 * browser Back pops the entry, which closes it.
 */
export function openOverlay(route: OverlayRoute, from: Opener) {
  opener = from;
  window.history.pushState({ [ENTRY_FLAG]: true }, '', urlFor(route));
}

/**
 * Closes the open overlay. When this session pushed its entry, step back over
 * it, so the history stays as it was before opening. After a direct visit to
 * a shared link there is nothing to step back to: drop the param in place.
 */
export function closeOverlay() {
  const state: unknown = window.history.state;
  const pushedHere = typeof state === 'object' && state !== null && ENTRY_FLAG in state;
  if (pushedHere) window.history.back();
  else window.history.replaceState(null, '', urlFor(null));
}

/** The element to return focus to: the opener, or the page trigger for this overlay. */
export function findTrigger(key: OverlayKey): HTMLElement | null {
  const { trigger } = opener;
  if (trigger?.isConnected && trigger.dataset.overlayTrigger === key) return trigger;
  return document.querySelector<HTMLElement>(`[data-overlay-trigger="${key}"]`);
}
