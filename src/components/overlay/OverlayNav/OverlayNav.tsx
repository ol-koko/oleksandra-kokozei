import { isPointerClick } from '@/features/focus/moveFocus';
import type { OverlaySectionView } from '@/features/overlay/useOverlayView';
import styles from './OverlayNav.module.css';

type OverlayNavProps = {
  label: string;
  items: readonly OverlaySectionView[];
  activeId?: string;
  /** Scrolls the overlay to the section; links never change the URL. */
  onSelect: (anchorId: string, fromPointer: boolean) => void;
  className?: string;
};

/** Sticky section nav at the side of a desktop overlay (Figma 76:687). Hidden on mobile. */
export function OverlayNav({ label, items, activeId, onSelect, className }: OverlayNavProps) {
  return (
    <nav aria-label={label} className={[styles.nav, className].filter(Boolean).join(' ')}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className="animate-caption">
            <a
              href={`#${item.anchorId}`}
              className={`nav-link ${styles.link} text-title-s`}
              aria-current={item.anchorId === activeId ? 'true' : undefined}
              onClick={(event) => {
                event.preventDefault();
                onSelect(item.anchorId, isPointerClick(event));
              }}
            >
              {item.navLabel}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
