'use client';

import { useTranslations } from 'next-intl';
import { VinylRecord } from '@/components/media/VinylRecord/VinylRecord';
import { Shelf, type ShelfEntry } from '@/components/overlay/Shelf/Shelf';
import { songs } from '@/content/songs';

/** "Fav songs" in overlay-me (130:38, 322:220): a vinyl record per song. */
export function OverlaySongs() {
  const t = useTranslations('Overlay.me.sections.music');

  const entries = songs.map((song): ShelfEntry => {
    const title = t(`items.${song.id}.title`);
    const artist = t(`items.${song.id}.artist`);
    return {
      id: song.id,
      title,
      byline: artist,
      renderMedia: ({ pressed, onToggle }) => (
        <VinylRecord
          cover={song.cover}
          alt={t('coverAlt', { title, artist })}
          pressed={pressed}
          onToggle={onToggle}
        />
      ),
    };
  });

  return <Shelf entries={entries} previousLabel={t('previous')} nextLabel={t('next')} />;
}
