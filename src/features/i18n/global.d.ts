import type messages from '../../../messages/en.json';
import type { routing } from './routing';

// English messages are the source of truth for keys; uk and de must mirror them.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
