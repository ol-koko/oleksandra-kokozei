import styles from './Divider.module.css';

type DividerProps = {
  className?: string;
};

/** 1 px rule between sections (Figma 224:371). */
export function Divider({ className }: DividerProps) {
  return <hr className={[styles.divider, className].filter(Boolean).join(' ')} />;
}
