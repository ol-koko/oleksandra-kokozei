import { getPathname } from './navigation';
import { routing } from './routing';

/** hreflang alternates of a path in every locale, plus `x-default` (English). */
export function languageAlternates(href: string) {
  return {
    ...Object.fromEntries(routing.locales.map((locale) => [locale, getPathname({ href, locale })])),
    'x-default': getPathname({ href, locale: routing.defaultLocale }),
  };
}
