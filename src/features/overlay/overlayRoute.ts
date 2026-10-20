import { workUrlSlugs } from '@/content/overlays';
import type { OverlayRoute, WorkSlug } from '@/content/types';
import { getWorkCase } from '@/content/workCases';
import { isPublishedWork } from '@/content/works';

/** `?overlay=me` opens overlay-me. */
const OVERLAY_PARAM = 'overlay';
/** `?work=<url slug>` opens a work overlay. */
const WORK_PARAM = 'work';
/** `&app=live` opens a work's live app in an overlay above its case (desktop). */
const APP_PARAM = 'app';
const APP_VALUE = 'live';
/** Marks history entries pushed by `openOverlay` and `openApp`, so closing can step back over them. */
const ENTRY_FLAG = '__overlayEntry';

/** Stable id of an overlay, used for keys, anchors and trigger lookup. */
export type OverlayKey = 'me' | `work-${WorkSlug}`;

export function overlayKey(route: OverlayRoute): OverlayKey {
  return route.kind === 'me' ? 'me' : `work-${route.slug}`;
}

export function isSameOverlay(a: OverlayRoute | null, b: OverlayRoute | null) {
  return a !== null && b !== null && overlayKey(a) === overlayKey(b);
}

/**
 * Reads the overlay from the query string. Unknown values, unpublished works
 * and works without a case study open nothing.
 */
export function parseOverlayRoute(params: Pick<URLSearchParams, 'get'>): OverlayRoute | null {
  if (params.get(OVERLAY_PARAM) === 'me') return { kind: 'me' };

  const workParam = params.get(WORK_PARAM);
  const slug = (Object.keys(workUrlSlugs) as WorkSlug[]).find(
    (key) => workUrlSlugs[key] === workParam,
  );
  return slug && isPublishedWork(slug) && getWorkCase(slug) ? { kind: 'work', slug } : null;
}

/** Whether the URL also opens the live app of the work overlay `route`. */
export function parseAppOpen(params: Pick<URLSearchParams, 'get'>, route: OverlayRoute | null) {
  return (
    route?.kind === 'work' &&
    getWorkCase(route.slug)?.liveApp !== undefined &&
    params.get(APP_PARAM) === APP_VALUE
  );
}

/** The query that opens `route`, for links that must keep it open (language switch). */
export function overlayQuery(route: OverlayRoute): Record<string, string> {
  return route.kind === 'me'
    ? { [OVERLAY_PARAM]: 'me' }
    : { [WORK_PARAM]: workUrlSlugs[route.slug] };
}

function urlFor(route: OverlayRoute | null, { app = false } = {}) {
  const url = new URL(window.location.href);
  url.searchParams.delete(OVERLAY_PARAM);
  url.searchParams.delete(WORK_PARAM);
  url.searchParams.delete(APP_PARAM);
  url.hash = '';
  if (route?.kind === 'me') url.searchParams.set(OVERLAY_PARAM, 'me');
  if (route?.kind === 'work') url.searchParams.set(WORK_PARAM, workUrlSlugs[route.slug]);
  if (app) url.searchParams.set(APP_PARAM, APP_VALUE);
  return url;
}

function isPushedEntry() {
  const state: unknown = window.history.state;
  return typeof state === 'object' && state !== null && ENTRY_FLAG in state;
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
  if (isPushedEntry()) window.history.back();
  else window.history.replaceState(null, '', urlFor(null));
}

/**
 * Opens the live app of the open work overlay as its own history entry, so
 * browser Back closes the app first and returns to the case.
 */
export function openApp(route: OverlayRoute, { fromPointer }: { fromPointer: boolean }) {
  appFromPointer = fromPointer;
  window.history.pushState({ [ENTRY_FLAG]: true }, '', urlFor(route, { app: true }));
}

let appFromPointer = false;

/** Whether the app overlay was opened by a pointer. After a direct visit, as for the keyboard. */
export function appOpenedFromPointer() {
  return appFromPointer;
}

/** Closes the live app and leaves its case open, like `closeOverlay`. */
export function closeApp(route: OverlayRoute) {
  if (isPushedEntry()) window.history.back();
  else window.history.replaceState(null, '', urlFor(route));
}

/** The element to return focus to: the opener, or the page trigger for this overlay. */
export function findTrigger(key: OverlayKey): HTMLElement | null {
  const { trigger } = opener;
  if (trigger?.isConnected && trigger.dataset.overlayTrigger === key) return trigger;
  return document.querySelector<HTMLElement>(`[data-overlay-trigger="${key}"]`);
}
