import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as getLocaleParam } from 'next/root-params';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/layout/SiteFooter/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader/SiteHeader';
import { routing } from '@/features/i18n/routing';
import { revealInitScript } from '@/features/reveal/revealInitScript';
import { figtree } from '@/styles/fonts';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');

  return {
    title: t('title'),
    description: t('description'),
  };
}

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
    // suppressHydrationWarning: revealInitScript adds a class to <html> before hydration.
    <html lang={locale} className={figtree.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealInitScript }} />
      </head>
      <body>
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
