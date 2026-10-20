import styles from './Divider.module.css';

type DividerProps = {
  className?: string;
  /** In an overlay: fades in with the content after it, never on its own (useOverlayReveal). */
  revealWithNext?: boolean;
};

/** 1 px rule between sections (Figma 224:371). */
export function Divider({ className, revealWithNext = false }: DividerProps) {
  return (
    <hr
      className={[styles.divider, className].filter(Boolean).join(' ')}
      data-reveal={revealWithNext ? 'with-next' : undefined}
    />
  );
}
