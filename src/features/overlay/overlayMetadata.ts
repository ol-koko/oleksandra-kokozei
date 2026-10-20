import type { Metadata, ResolvingMetadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as getLocaleParam } from 'next/root-params';
import { openGraphLocales } from '@/content/site';
import type { OverlayRoute } from '@/content/types';
import { languageAlternates } from '@/features/i18n/alternates';
import { getPathname } from '@/features/i18n/navigation';
import { routing } from '@/features/i18n/routing';
import { overlayPath, workSlugFromUrl } from './overlayRoute';

/**
 * An overlay path's own title, description, canonical URL and hreflang
 * alternates. Its own `openGraph` and `twitter` replace the layout's, so the
 * share images (file conventions in `src/app/[locale]`) are carried over from
 * the parent.
 */
async function overlayMetadata(route: OverlayRoute, parent: ResolvingMetadata): Promise<Metadata> {
  const locale = await getLocaleParam();
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const name = route.kind === 'me' ? t('Overlay.me.title') : t(`Works.items.${route.slug}.title`);
  const title = t('Metadata.pageTitle', { title: name });
  const description =
    route.kind === 'me' ? t('Me.bio.p1') : t(`WorkCases.${route.slug}.description`);
  const href = overlayPath(route);
  const url = getPathname({ href, locale });
  const { openGraph, twitter } = await parent;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(href),
    },
    openGraph: {
      type: route.kind === 'me' ? 'website' : 'article',
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

/** Metadata of `/me`. */
export function meMetadata(parent: ResolvingMetadata) {
  return overlayMetadata({ kind: 'me' }, parent);
}

/**
 * Metadata of `/works/<slug>`. The live app (`/works/<slug>/app`) shares it,
 * canonical included, so the app view never competes with its case.
 */
export function workMetadata(urlSlug: string, parent: ResolvingMetadata) {
  const slug = workSlugFromUrl(urlSlug);
  if (!slug) notFound();
  return overlayMetadata({ kind: 'work', slug }, parent);
}
