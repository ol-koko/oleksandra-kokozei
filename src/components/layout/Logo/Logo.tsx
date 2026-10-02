import { useTranslations } from 'next-intl';
import { SunIcon } from '@/components/icons/SunIcon';
import { Link } from '@/features/i18n/navigation';
import styles from './Logo.module.css';

type LogoProps = {
  className?: string;
};

/** Logo mark + name, linking to the top of the home page. Never a heading. */
export function Logo({ className }: LogoProps) {
  const t = useTranslations('Common');

  return (
    <Link
      href="/"
      className={['hover-link', styles.logo, 'text-body-m', className].filter(Boolean).join(' ')}
    >
      <SunIcon className={styles.mark} />
      <span className={styles.name}>{t('name')}</span>
    </Link>
  );
}
