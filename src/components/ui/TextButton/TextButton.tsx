import type { ComponentProps } from 'react';
import styles from './TextButton.module.css';

/** Classes of the quiet text button ("more", "close"); a link can wear them too. */
export const textButtonClassName = `hover-link text-body-m ${styles.button}`;

/** Quiet text button (Figma 790:594): body-m, muted, round. Use `aria-expanded` when it toggles content. */
export function TextButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={[textButtonClassName, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
