import { hasLocale } from 'next-intl';
import type { NextRequest } from 'next/server';
import { LOCALE_COOKIE } from './localeCookie';
import { routing, supportedLocales, type Locale, type SupportedLocale } from './routing';

/**
 * Countries that get a translated site; everyone else stays on English. A country
 * whose locale is disabled (UA while `uk` is off) stays on English too.
 */
const COUNTRY_LOCALES: Partial<Record<string, SupportedLocale>> = {
  UA: 'uk',
  DE: 'de',
  AT: 'de',
  CH: 'de',
};

/** Set by Vercel on every request: ISO 3166-1 alpha-2 code of the visitor's IP. */
const COUNTRY_HEADER = 'x-vercel-ip-country';

// Crawlers index each locale at its own URL (hreflang), so they are never redirected.
const CRAWLER = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|lighthouse/i;

/** Whether the path already names a locale (`/uk`, `/de/works/ces`, `/en`). */
export function hasLocalePrefix(pathname: string) {
  return hasLocale(routing.locales, pathname.split('/')[1]);
}

function country(request: NextRequest) {
  // Local development has no Vercel geo header: `DEV_COUNTRY=UA npm run dev` simulates one.
  if (process.env.NODE_ENV !== 'production' && process.env.DEV_COUNTRY) {
    return process.env.DEV_COUNTRY;
  }
  return request.headers.get(COUNTRY_HEADER);
}

/**
 * The locale an unprefixed (English) URL should move to: the saved choice
 * first, then the visitor's country. Null keeps English.
 */
export function detectLocale(request: NextRequest): Locale | null {
  if (CRAWLER.test(request.headers.get('user-agent') ?? '')) return null;

  // A saved disabled locale (`uk` while it is off) counts as no choice.
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = hasLocale(routing.locales, saved)
    ? saved
    : COUNTRY_LOCALES[country(request)?.toUpperCase() ?? ''];
  return hasLocale(routing.locales, locale) && locale !== routing.defaultLocale ? locale : null;
}

/** The same URL in English when it names a disabled locale (`/uk/works/ces` → `/works/ces`). */
export function withoutDisabledLocale(url: URL): URL | null {
  const [, first = '', ...rest] = url.pathname.split('/');
  const supported: readonly string[] = supportedLocales;
  if (!supported.includes(first) || hasLocale(routing.locales, first)) return null;
  const target = new URL(url);
  target.pathname = `/${rest.join('/')}`;
  return target;
}

/** The same URL under a locale prefix: `/works/ces?x=1` → `/de/works/ces?x=1`. */
export function withLocalePrefix(url: URL, locale: Locale): URL {
  const target = new URL(url);
  target.pathname = `/${locale}${url.pathname === '/' ? '' : url.pathname}`;
  return target;
}
