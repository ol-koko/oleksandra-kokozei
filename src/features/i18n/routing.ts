import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'uk', 'de'],
  defaultLocale: 'en',
  // English is served at `/`, other locales at `/uk` and `/de`.
  localePrefix: 'as-needed',
  // src/proxy.ts detects the locale itself (saved choice > Vercel country > en),
  // so next-intl never infers it from Accept-Language.
  localeDetection: false,
  // The language switcher writes the cookie only on an explicit choice (localeCookie.ts).
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];
