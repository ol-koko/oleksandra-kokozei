import styles from './MediaSkeleton.module.css';

type MediaSkeletonProps = {
  /** The media is ready: the highlight stops and the media, faded in on top, covers the placeholder. */
  ready: boolean;
};

/**
 * Loading placeholder that fills its positioned parent, so it takes the
 * media's exact shape. A light band sweeps across it until the media is
 * ready; with reduced motion it is a plain placeholder. Render it before the
 * media so the media stacks above it.
 */
export function MediaSkeleton({ ready }: MediaSkeletonProps) {
  return (
    <span className={styles.skeleton} aria-hidden="true">
      {!ready && <span className={`${styles.band} animate-shimmer`} />}
    </span>
  );
}
