import type { Locale } from '@/features/i18n/routing';
import type { SectionId } from './types';

/**
 * Page sections in navigation order (Me, Works, Experience) for every nav.
 * Labels live in messages (`Nav.*`), hidden headings in `Sections.*`.
 */
export const sectionIds = ['me', 'works', 'experience'] as const satisfies readonly SectionId[];

/**
 * Language switcher order, as in Figma. Visible labels (`ua`, `en`, `de`) and
 * full language names live in messages (`Languages.*`).
 */
export const languageOrder = ['uk', 'en', 'de'] as const satisfies readonly Locale[];
