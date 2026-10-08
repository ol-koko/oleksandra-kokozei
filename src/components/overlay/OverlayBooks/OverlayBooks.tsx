'use client';

import { useTranslations } from 'next-intl';
import { Book } from '@/components/media/Book/Book';
import { Shelf, type ShelfEntry } from '@/components/overlay/Shelf/Shelf';
import { books } from '@/content/books';

/** "Books" in overlay-me (84:312, 322:256): an opening book per title. */
export function OverlayBooks() {
  const t = useTranslations('Overlay.me.sections.books');

  const entries = books.map((book): ShelfEntry => {
    const title = t(`items.${book.id}.title`);
    const author = t(`items.${book.id}.author`);
    return {
      id: book.id,
      title,
      byline: author,
      renderMedia: ({ pressed, onToggle }) => (
        <Book
          cover={book.cover}
          backColor={book.backColor}
          alt={t('coverAlt', { title, author })}
          pressed={pressed}
          onToggle={onToggle}
        />
      ),
    };
  });

  return <Shelf entries={entries} previousLabel={t('previous')} nextLabel={t('next')} />;
}
