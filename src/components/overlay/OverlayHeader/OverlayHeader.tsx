import { Logo } from '@/components/layout/Logo/Logo';
import { MobileMenu } from '@/components/layout/MobileMenu/MobileMenu';
import type { SectionId } from '@/content/types';
import styles from './OverlayHeader.module.css';

type OverlayHeaderProps = {
  /** Highlighted in the menu: the page section the overlay belongs to. */
  activeId: SectionId;
  className?: string;
};

/**
 * The mobile header repeated at the top of a full-screen overlay (Figma
 * 275:815). The burger opens the normal mobile menu; its section links close
 * the overlay and scroll the page (handled by the overlay).
 */
export function OverlayHeader({ activeId, className }: OverlayHeaderProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(' ')}>
      <div className={styles.brand}>
        <Logo />
      </div>
      <MobileMenu activeId={activeId} />
    </header>
  );
}
