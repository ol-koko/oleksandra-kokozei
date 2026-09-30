import { Polaroid } from '@/components/media/Polaroid/Polaroid';
import type { ImageAsset } from '@/content/types';
import { Signature } from '@/features/signature/Signature';
import styles from './PolaroidSign.module.css';

/** Portrait tilt in Figma (179:770). */
const PORTRAIT_ROTATION = -10.44;

type PolaroidSignProps = {
  image: ImageAsset;
  alt: string;
  preload?: boolean;
};

/**
 * Tilted portrait polaroid with the handwritten signature on its lower edge
 * (Figma component 179:773). Fills its container's width and scales down
 * below the 358 px mobile column.
 */
export function PolaroidSign({ image, alt, preload }: PolaroidSignProps) {
  return (
    <div className={styles.root}>
      <div className={styles.slot}>
        <div className={styles.stage}>
          <Polaroid image={image} alt={alt} rotation={PORTRAIT_ROTATION} preload={preload} />
          <Signature className={styles.signature} />
        </div>
      </div>
    </div>
  );
}
