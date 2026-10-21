import type { Locale } from './routing';

/** Functional cookie with the language the visitor picked in the switcher. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/** Remembers an explicit language choice, so detection never overrides it. */
export function saveLocaleChoice(locale: Locale) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax${secure}`;
}
