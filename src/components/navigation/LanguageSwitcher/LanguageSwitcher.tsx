'use client';

import { useLocale, useTranslations } from 'next-intl';
import { languageOrder } from '@/content/navigation';
import type { SectionId } from '@/content/types';
import { saveLocaleChoice } from '@/features/i18n/localeCookie';
import { getPathname, usePathname } from '@/features/i18n/navigation';
import styles from './LanguageSwitcher.module.css';

type LanguageSwitcherProps = {
  label: string;
  /** Section in view; carried as a hash that the new page scrolls to and then removes. */
  activeId?: SectionId;
  onNavigate?: () => void;
  className?: string;
};

export function LanguageSwitcher({
  label,
  activeId,
  onNavigate,
  className,
}: LanguageSwitcherProps) {
  const t = useTranslations('Languages');
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={className}>
      <ul className={styles.list}>
        {languageOrder.map((locale) => (
          <li key={locale}>
            {/*
             * A plain anchor: switching locale swaps the root layout, so it is a full navigation
             * anyway. getPathname keeps the default locale unprefixed (/, /uk, /de), which
             * next-intl's Link does not when `locale` is set. The pathname keeps an open overlay
             * open (`/uk/works/ces`).
             */}
            <a
              href={`${getPathname({ locale, href: pathname })}${activeId ? `#${activeId}` : ''}`}
              hrefLang={locale}
              className={`lang-pill ${styles.chip} text-body-m`}
              aria-current={locale === currentLocale ? 'true' : undefined}
              onClick={() => {
                saveLocaleChoice(locale);
                onNavigate?.();
              }}
            >
              {t(`${locale}.label`)}
              <span className="visually-hidden" lang={locale}>
                {' '}
                {t(`${locale}.name`)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
