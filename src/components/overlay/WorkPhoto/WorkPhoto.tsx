import { WorkMedia } from '@/components/overlay/WorkMedia/WorkMedia';
import type { ImageAsset, WorkMediaAsset } from '@/content/types';
import styles from './WorkPhoto.module.css';

type WorkPhotoProps = {
  media: WorkMediaAsset;
  logo?: ImageAsset;
  alt: string;
  caption: string;
  eager?: boolean;
  /** The frame takes the media's own ratio instead of the standard one. */
  ownRatio?: boolean;
};

/** A case study photo or video with its caption below (Figma "photo + subtitle", 472:671). */
export function WorkPhoto({ media, logo, alt, caption, eager, ownRatio }: WorkPhotoProps) {
  return (
    <figure className={styles.photo}>
      <WorkMedia media={media} logo={logo} alt={alt} eager={eager} ownRatio={ownRatio} />
      <figcaption className={`${styles.caption} text-body-2xs`} data-reveal>
        {caption}
      </figcaption>
    </figure>
  );
}
