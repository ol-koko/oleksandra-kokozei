import { hasLocale } from 'next-intl';
import type { OverlayRoute } from '@/content/types';
import { getWorkCase } from '@/content/workCases';
import { routing } from '@/features/i18n/routing';
import { overlayPath, workSlugFromUrl } from './overlayRoute';

/** Query params of the old overlay URLs: `/?overlay=me`, `/uk?work=ces`, `/?work=<slug>&app=live`. */
const OVERLAY_PARAM = 'overlay';
const WORK_PARAM = 'work';
const APP_PARAM = 'app';
const APP_VALUE = 'live';

/**
 * The clean path an old overlay URL moved to (`/uk?work=ces` → `/uk/works/ces`),
 * keeping the locale and any other query params. Null when the URL names no
 * overlay that opens, so it stays the page, as before.
 */
export function legacyOverlayUrl(url: URL): URL | null {
  const params = url.searchParams;
  const workSlug = workSlugFromUrl(params.get(WORK_PARAM) ?? '');
  const route: OverlayRoute | null =
    params.get(OVERLAY_PARAM) === 'me'
      ? { kind: 'me' }
      : workSlug
        ? { kind: 'work', slug: workSlug }
        : null;
  if (!route) return null;

  // Overlays only ever opened on the page itself: `/`, `/uk`, `/de`.
  const [locale, ...rest] = url.pathname.split('/').filter(Boolean);
  if (rest.length > 0 || (locale !== undefined && !hasLocale(routing.locales, locale))) return null;

  const app =
    route.kind === 'work' &&
    params.get(APP_PARAM) === APP_VALUE &&
    getWorkCase(route.slug)?.liveApp !== undefined;
  const prefix = locale && locale !== routing.defaultLocale ? `/${locale}` : '';
  const target = new URL(url);
  target.pathname = `${prefix}${overlayPath(route, { app })}`;
  [OVERLAY_PARAM, WORK_PARAM, APP_PARAM].forEach((param) => target.searchParams.delete(param));
  return target;
}
