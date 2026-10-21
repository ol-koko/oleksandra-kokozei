'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { languageOrder } from '@/content/navigation';
import type { SectionId } from '@/content/types';
import { saveLocaleChoice } from '@/features/i18n/localeCookie';
import { getPathname, usePathname } from '@/features/i18n/navigation';
import type { Locale } from '@/features/i18n/routing';
import { prefetchDocument } from '@/features/navigation/prefetchDocument';
import styles from './LanguageSwitcher.module.css';

type LanguageSwitcherProps = {
  label: string;
  /** Section in view; carried as a hash that the new page scrolls to and then removes. */
  activeId?: SectionId;
  onNavigate?: () => void;
  className?: string;
};

/** A left click or Enter without modifiers: the switch happens in this tab. */
function isPlainActivation(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

/** Puts the indicator under a chip (hover.css reads --pill-x and --pill-w). */
function placeIndicator(indicator: HTMLElement, chip: HTMLElement) {
  indicator.style.setProperty('--pill-x', `${chip.offsetLeft}px`);
  indicator.style.setProperty('--pill-w', `${chip.offsetWidth}px`);
}

/** The indicator geometry under a chip, as a keyframe. */
function chipFrame(chip: HTMLElement): Keyframe {
  return { transform: `translateX(${chip.offsetLeft}px)`, width: `${chip.offsetWidth}px` };
}

/** A motion token duration (`250ms`, `0.25s`) in milliseconds. */
function toMilliseconds(duration: string) {
  const value = parseFloat(duration);
  if (!Number.isFinite(value)) return 0;
  return duration.trim().endsWith('ms') ? value : value * 1000;
}

/** How long past the slide the safety fallback waits before navigating anyway. */
const FALLBACK_SLACK_MS = 200;

export function LanguageSwitcher({
  label,
  activeId,
  onNavigate,
  className,
}: LanguageSwitcherProps) {
  const t = useTranslations('Languages');
  const currentLocale = useLocale();
  const pathname = usePathname();
  const indicatorRef = useRef<HTMLSpanElement>(null);
  /** The chip the indicator slides to; null while the active chip shows its own background. */
  const [target, setTarget] = useState<Locale | null>(null);

  // Back/forward cache restores the page mid-switch: show the active chip again.
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (event.persisted) setTarget(null);
    };
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  function switchTo(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    // One switch at a time: the page is already on its way to the first choice.
    if (target) {
      event.preventDefault();
      return;
    }
    saveLocaleChoice(locale);
    const chip = event.currentTarget;
    const indicator = indicatorRef.current;
    const from = chip.closest('nav')?.querySelector<HTMLElement>('[aria-current="true"]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (
      locale === currentLocale ||
      !isPlainActivation(event) ||
      !indicator ||
      !from ||
      reducedMotion
    ) {
      // The anchor navigates on its own, instantly.
      onNavigate?.();
      return;
    }

    // A language switch is a full document navigation (new root layout), so the
    // slide plays first and the prefetched page loads when it ends.
    event.preventDefault();
    // Prefetched only now: the cookie just changed, and a prefetch made before that is dropped.
    const href = chip.href;
    prefetchDocument(href);
    placeIndicator(indicator, chip);
    setTarget(locale);

    let navigated = false;
    const navigate = () => {
      if (navigated) return;
      navigated = true;
      onNavigate?.();
      window.location.assign(href);
    };

    const tokens = getComputedStyle(indicator);
    const duration = toMilliseconds(tokens.getPropertyValue('--motion-duration-moderate'));
    const easing = tokens.getPropertyValue('--motion-easing-emphasized').trim() || 'ease-out';
    // Safety net: a switch never waits longer than the slide, whatever happens to it.
    window.setTimeout(navigate, duration + FALLBACK_SLACK_MS);
    // Web Animations rather than a CSS transition: the animation exists as soon as it is
    // created, so `finished` waits for the slide in every engine. Waiting on a transition
    // via getAnimations() depends on when the engine creates it; an empty list resolves at
    // once, which navigated without a slide on iOS Safari.
    try {
      indicator
        .animate([chipFrame(from), chipFrame(chip)], { duration, easing })
        .finished.then(navigate, navigate);
    } catch {
      navigate();
    }
  }

  return (
    <nav aria-label={label} className={className}>
      <div className={`lang-switch ${styles.track}`} data-sliding={target ? '' : undefined}>
        <span ref={indicatorRef} className="lang-switch__indicator" aria-hidden="true" />
        <ul className={styles.list}>
          {languageOrder.map((locale) => {
            const href = `${getPathname({ locale, href: pathname })}${activeId ? `#${activeId}` : ''}`;
            return (
              <li key={locale}>
                {/*
                 * A plain anchor: switching locale swaps the root layout, so it is a full
                 * navigation anyway. getPathname keeps the default locale unprefixed (/, /uk,
                 * /de), which next-intl's Link does not when `locale` is set. The pathname keeps
                 * an open overlay open (`/de/works/ces`).
                 */}
                <a
                  href={href}
                  hrefLang={locale}
                  className={`lang-pill ${styles.chip} text-body-m`}
                  aria-current={locale === currentLocale ? 'true' : undefined}
                  data-target={locale === target ? '' : undefined}
                  onClick={(event) => switchTo(event, locale)}
                >
                  {t(`${locale}.label`)}
                  <span className="visually-hidden" lang={locale}>
                    {' '}
                    {t(`${locale}.name`)}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
