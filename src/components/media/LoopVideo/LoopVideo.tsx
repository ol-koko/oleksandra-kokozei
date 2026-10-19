'use client';

import { useEffect, useRef, useState } from 'react';
import { MediaSkeleton } from '@/components/media/MediaSkeleton/MediaSkeleton';
import type { VideoAsset } from '@/content/types';
import { useInView } from '@/features/media/useInView';
import { useMediaQuery } from '@/features/motion/useMediaQuery';
import styles from './LoopVideo.module.css';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** Asks Safari on iOS, which ignores `preload`, to fetch the first frame. */
const FIRST_FRAME = '#t=0.001';

type LoopVideoProps = {
  video: VideoAsset;
  /** Accessible name. Without one the video is decorative and hidden from assistive tech. */
  label?: string;
};

/**
 * A silent looping video that fills its positioned parent, with a skeleton
 * until its first frame is ready. Sources (WebM, then MP4) are attached only
 * when the video nears the viewport; it plays while on screen and pauses
 * off screen. With reduced motion it never plays and shows its first frame.
 */
export function LoopVideo({ video, label }: LoopVideoProps) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { near, inView } = useInView(frameRef);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !near) return;
    if (inView && !reducedMotion) {
      // Autoplay policies check the property; React does not set it on the first render.
      element.muted = true;
      // A rejected play (power saving, autoplay blocked) leaves the first frame showing.
      element.play().catch(() => {});
    } else {
      element.pause();
    }
  }, [near, inView, reducedMotion]);

  return (
    <span ref={frameRef} className={styles.frame}>
      <MediaSkeleton ready={ready} />
      <video
        ref={videoRef}
        className={styles.video}
        data-ready={ready || undefined}
        muted
        loop
        playsInline
        disablePictureInPicture
        preload={near ? 'auto' : 'none'}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        onLoadedData={() => setReady(true)}
      >
        {near && (
          <>
            <source src={`${video.webm}${FIRST_FRAME}`} type="video/webm" />
            <source src={`${video.mp4}${FIRST_FRAME}`} type="video/mp4" />
          </>
        )}
      </video>
    </span>
  );
}
