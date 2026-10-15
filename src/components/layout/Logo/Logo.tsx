import { useTranslations } from 'next-intl';
import { Link } from '@/features/i18n/navigation';
import { SandText, type SandPlacement } from './SandText';
import styles from './Logo.module.css';

type LogoProps = {
  /** Where the sand animation runs; omitted for none (mobile menu, overlay header). */
  animation?: SandPlacement;
  /** 16 in the headers, 18 in the footer (Figma 220:76, 233:621). */
  typography?: 'text-body-m' | 'text-title-s';
  className?: string;
};

/** Logo (the name), linking to the top of the home page. Never a heading. */
export function Logo({ animation, typography = 'text-body-m', className }: LogoProps) {
  const t = useTranslations('Common');
  const name = t('name');

  return (
    <Link
      href="/"
      className={['hover-link', styles.logo, typography, className].filter(Boolean).join(' ')}
    >
      {animation ? <SandText text={name} placement={animation} /> : name}
    </Link>
  );
}
