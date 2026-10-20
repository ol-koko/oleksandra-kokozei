import { WorkMedia } from '@/components/overlay/WorkMedia/WorkMedia';
import type { ImageAsset, VideoAsset } from '@/content/types';
import styles from './WorkPhoto.module.css';

type WorkPhotoProps = {
  media: ImageAsset | VideoAsset;
  logo?: ImageAsset;
  alt: string;
  caption: string;
  eager?: boolean;
};

/** A case study photo or video with its caption below (Figma "photo + subtitle", 472:671). */
export function WorkPhoto({ media, logo, alt, caption, eager }: WorkPhotoProps) {
  return (
    <figure className={styles.photo}>
      <WorkMedia media={media} logo={logo} alt={alt} eager={eager} />
      <figcaption className={`${styles.caption} text-body-2xs`}>{caption}</figcaption>
    </figure>
  );
}
