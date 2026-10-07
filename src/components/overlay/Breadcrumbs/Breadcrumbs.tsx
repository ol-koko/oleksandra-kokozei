import { useTranslations } from 'next-intl';
import { CaretRightIcon } from '@/components/icons/CaretRightIcon';
import { isPointerClick } from '@/features/focus/moveFocus';
import styles from './Breadcrumbs.module.css';

type BreadcrumbsProps = {
  /** The page section the overlay belongs to ("Me", "Works"). */
  parentLabel: string;
  /** The overlay itself ("More", the work title). */
  current: string;
  /** The first crumb is the mobile exit control (D10): it closes the overlay. */
  onExit: (fromPointer: boolean) => void;
  className?: string;
};

/** "Me › More" / "Works › CES" at the top of a mobile overlay (Figma 275:997). */
export function Breadcrumbs({ parentLabel, current, onExit, className }: BreadcrumbsProps) {
  const t = useTranslations('Overlay');

  return (
    <nav aria-label={t('breadcrumbs')} className={className}>
      <ol className={`${styles.list} text-title-s`}>
        <li className={styles.item}>
          <button
            type="button"
            className={`nav-link ${styles.exit}`}
            onClick={(event) => onExit(isPointerClick(event))}
          >
            {parentLabel}
            <span className="visually-hidden">{t('backToPage')}</span>
          </button>
        </li>
        <li className={styles.item}>
          <CaretRightIcon className={styles.caret} />
          <span className={styles.current} aria-current="page">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}
