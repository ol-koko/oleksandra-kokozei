import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as getLocaleParam } from 'next/root-params';
import type { ReactNode } from 'react';
import { routing } from '@/features/i18n/routing';
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
    <html lang={locale} className={figtree.variable}>
      <body>
        <a className="skip-link text-body-m" href="#content">
          {t('skipToContent')}
        </a>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
