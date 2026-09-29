import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'uk', 'de'],
  defaultLocale: 'en',
  // English is served at `/`, other locales at `/uk` and `/de`.
  localePrefix: 'as-needed',
  // Detection (saved choice > Vercel geo > en) is planned for a later stage.
  // Until then, never infer the locale from Accept-Language.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
