'use client';

import { useTranslations } from 'next-intl';
import { PolaroidAlbum, type AlbumLabels } from '@/components/media/PolaroidAlbum/PolaroidAlbum';
import { album } from '@/content/album';

/** "Album" in overlay-me (428:349, 428:408): a Polaroid album that turns its pages. */
export function OverlayAlbum() {
  const t = useTranslations('Overlay.me.sections.album');

  const labels: AlbumLabels = {
    group: t('label'),
    open: t('open'),
    close: t('close'),
    previous: t('previous'),
    next: t('next'),
    pageStatus: (current, total) => t('pageStatus', { current, total }),
    photoAlt: (id) => t(`photos.${id}` as const),
  };

  return <PolaroidAlbum album={album} labels={labels} />;
}
