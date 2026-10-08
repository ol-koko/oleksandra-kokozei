import type { Locale } from '@/features/i18n/routing';

export const contactEmail = 'oleksandra.kokozei.ux@gmail.com';

/** Time zone of the location shown next to the footer clock (Stuttgart, Germany). */
export const homeTimeZone = 'Europe/Berlin';

/** Production origin, used to resolve absolute URLs in link previews. */
export const siteUrl = 'https://oleksandra-kokozei.com';

/** Open Graph locale (`og:locale`) for each site locale. */
export const openGraphLocales: Record<Locale, string> = {
  en: 'en_US',
  uk: 'uk_UA',
  de: 'de_DE',
};

/**
 * Browser UI color (`<meta name="theme-color">`). Meta tags cannot read CSS
 * variables, so this mirrors `--color-background-page` (`--gray-0`).
 */
export const themeColor = '#ffffff';
