import { getTranslations } from 'next-intl/server';
import { sectionIds } from '@/content/navigation';
import styles from './page.module.css';

export default async function HomePage() {
  const t = await getTranslations('Sections');

  return (
    <main id="content" className={styles.main}>
      {sectionIds.map((id) => {
        const headingId = `${id}-heading`;

        return (
          <section key={id} id={id} aria-labelledby={headingId} className={styles.section}>
            {/* Hidden until the section content lands; the Hero stage adds the page's single h1. */}
            <h2 id={headingId} className="visually-hidden">
              {t(id)}
            </h2>
          </section>
        );
      })}
    </main>
  );
}
