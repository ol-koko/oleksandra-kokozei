import type { Metadata, ResolvingMetadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as getLocaleParam } from 'next/root-params';
import {
  designSystemDescription,
  designSystemPath,
  designSystemTitle,
} from '@/content/designSystem';
import { openGraphLocales } from '@/content/site';
import { languageAlternates } from '@/features/i18n/alternates';
import { getPathname } from '@/features/i18n/navigation';
import { routing } from '@/features/i18n/routing';

/**
 * The page's own title, description, canonical URL and hreflang alternates. Its
 * title and description stay English in every locale (technical documentation);
 * the "| Oleksandra Kokozei" suffix follows the site's title pattern. The share
 * images are carried over from the parent layout.
 */
export async function designSystemMetadata(parent: ResolvingMetadata): Promise<Metadata> {
  const locale = await getLocaleParam();
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const title = t('Metadata.pageTitle', { title: designSystemTitle });
  const description = designSystemDescription;
  const url = getPathname({ href: designSystemPath, locale });
  const { openGraph, twitter } = await parent;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(designSystemPath),
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
      images: openGraph?.images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: twitter?.images,
    },
  };
}
