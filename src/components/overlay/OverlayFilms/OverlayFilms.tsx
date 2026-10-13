'use client';

import { useTranslations } from 'next-intl';
import { VhsTape } from '@/components/media/VhsTape/VhsTape';
import { Shelf, type ShelfEntry } from '@/components/overlay/Shelf/Shelf';
import { films } from '@/content/films';

/** "Films" in overlay-me (417:771, 421:258): a VHS tape per film, its year as the byline. */
export function OverlayFilms() {
  const t = useTranslations('Overlay.me.sections.films');

  const entries = films.map((film): ShelfEntry => {
    const title = t(`items.${film.id}.title`);
    const year = String(film.year);
    return {
      id: film.id,
      title,
      byline: year,
      renderMedia: ({ pressed, onToggle }) => (
        <VhsTape
          poster={film.cover}
          alt={t('posterAlt', { title, year })}
          pressed={pressed}
          onToggle={onToggle}
        />
      ),
    };
  });

  return <Shelf entries={entries} previousLabel={t('previous')} nextLabel={t('next')} />;
}
