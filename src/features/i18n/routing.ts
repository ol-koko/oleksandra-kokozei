import { defineRouting } from 'next-intl/routing';

/** Every locale with messages in `messages/`. */
export const supportedLocales = ['en', 'uk', 'de'] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

/**
 * The locales the site serves. Ukrainian is off until a font with Cyrillic glyphs
 * replaces Figtree: to re-enable it, change this line to `['en', 'uk', 'de']`.
 * A disabled locale's URLs redirect to English (src/proxy.ts).
 */
const enabledLocales = ['en', 'de'] as const satisfies readonly SupportedLocale[];

export const routing = defineRouting({
  locales: enabledLocales,
  defaultLocale: 'en',
  // English is served at `/`, other locales under their prefix (`/de`).
  localePrefix: 'as-needed',
  // src/proxy.ts detects the locale itself (saved choice > Vercel country > en),
  // so next-intl never infers it from Accept-Language.
  localeDetection: false,
  // The language switcher writes the cookie only on an explicit choice (localeCookie.ts).
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];
