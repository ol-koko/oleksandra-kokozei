import { hasLocale } from 'next-intl';
import { workUrlSlugs } from '@/content/overlays';
import type { OverlayRoute, WorkSlug } from '@/content/types';
import { getWorkCase } from '@/content/workCases';
import { isPublishedWork } from '@/content/works';
import { routing } from '@/features/i18n/routing';

/** Route segments, matching the folders in `src/app/[locale]`: `/me`, `/works/<url slug>[/app]`. */
const ME_SEGMENT = 'me';
const WORKS_SEGMENT = 'works';
const APP_SEGMENT = 'app';
/** Marks history entries opened from the page, so closing can step back over them. */
const ENTRY_FLAG = '__overlayEntry';

/** Stable id of an overlay, used for keys, anchors and trigger lookup. */
export type OverlayKey = 'me' | `work-${WorkSlug}`;

/** What an overlay path opens: the overlay, and on desktop the work's live app above it. */
export type OverlayLocation = { route: OverlayRoute; app: boolean };

export function overlayKey(route: OverlayRoute): OverlayKey {
  return route.kind === 'me' ? 'me' : `work-${route.slug}`;
}

export function isSameOverlay(a: OverlayRoute | null, b: OverlayRoute | null) {
  return a !== null && b !== null && overlayKey(a) === overlayKey(b);
}

/** Works whose overlay opens: published, with a case study. */
export function openableWorkSlugs(): WorkSlug[] {
  return (Object.keys(workUrlSlugs) as WorkSlug[]).filter(
    (slug) => isPublishedWork(slug) && getWorkCase(slug) !== undefined,
  );
}

/** Openable works that also have a live app overlay. */
export function liveAppWorkSlugs(): WorkSlug[] {
  return openableWorkSlugs().filter((slug) => getWorkCase(slug)?.liveApp !== undefined);
}

/** Static params of `/works/[slug]`. */
export function workRouteParams() {
  return openableWorkSlugs().map((slug) => ({ slug: workUrlSlugs[slug] }));
}

/** Static params of `/works/[slug]/app`. */
export function appRouteParams() {
  return liveAppWorkSlugs().map((slug) => ({ slug: workUrlSlugs[slug] }));
}

/** The openable work behind a URL slug (`ju-jutsu`), if any. */
export function workSlugFromUrl(urlSlug: string): WorkSlug | undefined {
  return openableWorkSlugs().find((slug) => workUrlSlugs[slug] === urlSlug);
}

/** The path that opens `route`, without the locale prefix (`/works/ces`). */
export function overlayPath(route: OverlayRoute, { app = false } = {}) {
  if (route.kind === 'me') return `/${ME_SEGMENT}`;
  const path = `/${WORKS_SEGMENT}/${workUrlSlugs[route.slug]}`;
  return app ? `${path}/${APP_SEGMENT}` : path;
}

/**
 * Reads the overlay from a pathname without the locale prefix. Unknown slugs,
 * unpublished works and works without a case study open nothing.
 */
export function parseOverlayPath(pathname: string): OverlayLocation | null {
  const [first, urlSlug, rest, ...extra] = pathname.split('/').filter(Boolean);
  if (first === ME_SEGMENT && urlSlug === undefined) return { route: { kind: 'me' }, app: false };
  if (first !== WORKS_SEGMENT || urlSlug === undefined || extra.length > 0) return null;

  const slug = workSlugFromUrl(urlSlug);
  if (!slug) return null;
  if (rest === undefined) return { route: { kind: 'work', slug }, app: false };
  return rest === APP_SEGMENT && getWorkCase(slug)?.liveApp !== undefined
    ? { route: { kind: 'work', slug }, app: true }
    : null;
}

/** Replaces the current entry with `path` in the current locale, without navigating. */
function replacePath(path: string) {
  const url = new URL(window.location.href);
  const [first] = url.pathname.split('/').filter(Boolean);
  const prefix = hasLocale(routing.locales, first) ? `/${first}` : '';
  url.pathname = `${prefix}${path}` || '/';
  url.hash = '';
  // Next.js syncs native `replaceState` with its router, so the page does not re-render.
  window.history.replaceState(null, '', url);
}

function isOpenedEntry() {
  const state: unknown = window.history.state;
  return typeof state === 'object' && state !== null && ENTRY_FLAG in state;
}

/** Path the router is about to push for an open from the page; marked once it lands. */
let pendingEntry: string | null = null;

/**
 * Called by the host whenever the path changes. When the router has just
 * pushed the entry of an overlay opened from the page, flags it, so closing
 * steps back over it instead of leaving it in the history.
 */
export function markOpenedEntry(pathname: string) {
  if (pendingEntry !== pathname) return;
  pendingEntry = null;
  // The router's own state is kept (`__NA`), so Next.js leaves this call alone.
  window.history.replaceState({ ...window.history.state, [ENTRY_FLAG]: true }, '');
}

type Opener = {
  /** The link that opened the overlay; focus returns to it on close. */
  trigger: HTMLElement | null;
  fromPointer: boolean;
};

let opener: Opener = { trigger: null, fromPointer: false };

/** The last opener. After a direct visit there is none, and focus moves as for the keyboard. */
export function getOpener() {
  return opener;
}

/**
 * Records a trigger about to open `route`. The link itself navigates: the
 * intercepting route keeps the page in place, the host renders the overlay,
 * and browser Back pops the entry, which closes it.
 */
export function rememberOpener(route: OverlayRoute, from: Opener) {
  opener = from;
  pendingEntry = overlayPath(route);
}

/**
 * Closes the open overlay. When it was opened from the page, step back over
 * its entry, so the history stays as it was before opening. After a direct
 * visit there is nothing to step back to: go to the page path in place.
 */
export function closeOverlay() {
  if (isOpenedEntry()) window.history.back();
  else replacePath('');
}

let appFromPointer = false;

/** Records an open of the live app above `route`; the caller pushes `overlayPath(route, { app: true })`. */
export function rememberAppOpener(route: OverlayRoute, { fromPointer }: { fromPointer: boolean }) {
  appFromPointer = fromPointer;
  pendingEntry = overlayPath(route, { app: true });
}

/** Whether the app overlay was opened by a pointer. After a direct visit, as for the keyboard. */
export function appOpenedFromPointer() {
  return appFromPointer;
}

/** Closes the live app and leaves its case open, like `closeOverlay`. */
export function closeApp(route: OverlayRoute) {
  if (isOpenedEntry()) window.history.back();
  else replacePath(overlayPath(route));
}

/** The element to return focus to: the opener, or the page trigger for this overlay. */
export function findTrigger(key: OverlayKey): HTMLElement | null {
  const { trigger } = opener;
  if (trigger?.isConnected && trigger.dataset.overlayTrigger === key) return trigger;
  return document.querySelector<HTMLElement>(`[data-overlay-trigger="${key}"]`);
}
