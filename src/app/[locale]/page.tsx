import { getTranslations } from 'next-intl/server';
import { socialLinks } from '@/content/links';
import styles from './page.module.css';

export default async function HomePage() {
  const t = await getTranslations('HomePlaceholder');
  const tLinks = await getTranslations('Links');

  return (
    <main className={styles.main}>
      <h1 className="text-title-l">{t('name')}</h1>
      <p className={`text-body-m ${styles.role}`}>{t('role')}</p>
      <p className={`text-body-l ${styles.status}`}>{t('status')}</p>
      <nav aria-label={t('socialNavLabel')}>
        <ul className={styles.links}>
          {socialLinks.map(({ id, href }) => (
            <li key={id}>
              <a className="text-body-m" href={href} target="_blank" rel="noopener noreferrer">
                {tLinks(`social.${id}`)}
                <span className="visually-hidden"> {tLinks('opensInNewTab')}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
