import { useTranslations } from 'next-intl';
import { Link } from '@/features/i18n/navigation';
import { SandText, type SandPlacement } from './SandText';
import styles from './Logo.module.css';

type LogoProps = {
  /** Where the sand animation runs; omitted for none (mobile menu, overlay header). */
  animation?: SandPlacement;
  className?: string;
};

/** Logo (the name), linking to the top of the home page. Never a heading. */
export function Logo({ animation, className }: LogoProps) {
  const t = useTranslations('Common');
  const name = t('name');

  return (
    <Link
      href="/"
      className={['hover-link', styles.logo, 'text-body-m', className].filter(Boolean).join(' ')}
    >
      {animation ? <SandText text={name} placement={animation} /> : name}
    </Link>
  );
}
