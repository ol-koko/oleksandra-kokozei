import type { ReactNode } from 'react';
import styles from './Pill.module.css';

type PillProps = {
  children: ReactNode;
  /** Extra rules from the place that uses it (the work card's hover scale). */
  className?: string;
};

/** The "Title・Year" tag on a work cover (Figma 57:496): a white pill with body-xs text. */
export function Pill({ children, className }: PillProps) {
  return (
    <span className={[styles.pill, 'text-body-xs', className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
