import type { SVGProps } from 'react';
import styles from './MenuToggleIcon.module.css';

type MenuToggleIconProps = SVGProps<SVGSVGElement> & {
  /** `true` shows the cross, `false` the two-line burger. Changes are animated. */
  open: boolean;
  /** Play the burger → cross morph each time the icon appears (e.g. when its dialog opens). */
  morphIn?: boolean;
};

/**
 * Menu toggle icon: `ci:menu-duo-lg` burger (Figma I233:657;233:583) that
 * morphs into a centered cross (the Lucide "x" geometry). CSS only: each line
 * rotates ±45° about its own center and shortens from 18 to 12√2.
 */
export function MenuToggleIcon({
  open,
  morphIn = false,
  className,
  ...props
}: MenuToggleIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      data-open={open}
      className={[styles.icon, morphIn && styles.morphIn, className].filter(Boolean).join(' ')}
      {...props}
    >
      <path className={`${styles.line} ${styles.top}`} d="M3 9H21" />
      <path className={`${styles.line} ${styles.bottom}`} d="M3 15H21" />
    </svg>
  );
}
