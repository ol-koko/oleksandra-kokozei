import type { CSSProperties } from 'react';
import { LocationIcon } from '@/components/icons/LocationIcon';
import styles from './LocationLabel.module.css';

type LocationLabelProps = {
  label: string;
  className?: string;
  style?: CSSProperties;
};

/** Pin icon + muted place name (Figma 5:89). */
export function LocationLabel({ label, className, style }: LocationLabelProps) {
  return (
    <p
      className={[styles.location, 'text-body-s', className].filter(Boolean).join(' ')}
      style={style}
    >
      <LocationIcon className={styles.icon} />
      {label}
    </p>
  );
}
