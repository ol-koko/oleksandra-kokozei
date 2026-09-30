import { LocationIcon } from '@/components/icons/LocationIcon';
import styles from './LocationLabel.module.css';

type LocationLabelProps = {
  label: string;
};

/** Pin icon + muted place name (Figma 5:89). */
export function LocationLabel({ label }: LocationLabelProps) {
  return (
    <p className={`${styles.location} text-body-s`}>
      <LocationIcon className={styles.icon} />
      {label}
    </p>
  );
}
