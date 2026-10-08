import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as getLocaleParam } from 'next/root-params';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/layout/SiteFooter/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader/SiteHeader';
import { openGraphLocales, siteUrl, themeColor } from '@/content/site';
import { getPathname } from '@/features/i18n/navigation';
import { routing } from '@/features/i18n/routing';
import { figtree } from '@/styles/fonts';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleParam();
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations('Metadata');
  const title = t('title');
  const description = t('description');
  const url = getPathname({ href: '/', locale });

  // Images (og:image, twitter:image, icons) come from the file conventions in `src/app`.
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((alternate) => [
            alternate,
            getPathname({ href: '/', locale: alternate }),
          ]),
        ),
        'x-default': getPathname({ href: '/', locale: routing.defaultLocale }),
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      locale: openGraphLocales[locale],
      alternateLocale: routing.locales
        .filter((alternate) => alternate !== locale)
        .map((alternate) => openGraphLocales[alternate]),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export const viewport: Viewport = {
  themeColor,
};

type LocaleLayoutProps = {
  children: ReactNode;
};

export default async function LocaleLayout({ children }: LocaleLayoutProps) {
  const locale = await getLocaleParam();
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations('Header');

  return (
    <html lang={locale} className={figtree.variable}>
      {/*
       * Browser extensions add attributes to <body> before React hydrates
       * (ColorZilla: `cz-shortcut-listen`), which React reports as a hydration
       * mismatch. This silences attribute mismatches on <body> itself only;
       * mismatches in the page content are still reported.
       */}
      <body suppressHydrationWarning>
        <a className="skip-link text-body-m" href="#content">
          {t('skipToContent')}
        </a>
        <NextIntlClientProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
