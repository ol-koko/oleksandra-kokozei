'use client';

import { useTranslations } from 'next-intl';
import { useRef, useState, useSyncExternalStore } from 'react';
import { ExpandIcon } from '@/components/icons/ExpandIcon';
import { LinkIcon } from '@/components/icons/LinkIcon';
import { MediaSkeleton } from '@/components/media/MediaSkeleton/MediaSkeleton';
import { WorkMedia } from '@/components/overlay/WorkMedia/WorkMedia';
import { projectSites } from '@/content/links';
import type { WorkEmbedCover } from '@/content/types';
import { useMediaQuery } from '@/features/motion/useMediaQuery';
import styles from './WorkEmbed.module.css';

/** The desktop overlay layout, where the app is embedded. Keep in sync with WorkEmbed.module.css. */
const DESKTOP_QUERY = '(min-width: 768px)';

/**
 * Only what the app needs: scripts, and its own origin, which keeps the
 * microphone permission (an opaque origin cannot hold one). The app is on
 * another origin, so it still cannot reach this page.
 */
const SANDBOX = 'allow-scripts allow-same-origin';

const subscribeNever = () => () => {};

type WorkEmbedProps = {
  cover: WorkEmbedCover;
  /** The work title, for the control labels. */
  title: string;
};

/**
 * A live app in place of a case cover. Desktop: the app in a phone-shaped
 * iframe on the cover gradient, with a skeleton until it has loaded and a
 * full-screen button. Mobile: the cover video and a link that opens the app
 * in a new tab; the iframe is never mounted there. Both layouts are sized by
 * CSS, so nothing shifts when the iframe mounts.
 */
export function WorkEmbed({ cover, title }: WorkEmbedProps) {
  const t = useTranslations('Overlay.work');
  const tCases = useTranslations('WorkCases');
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const canFullScreen = useSyncExternalStore(
    subscribeNever,
    () => document.fullscreenEnabled,
    () => false,
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const href = projectSites.find((site) => site.id === cover.embed)?.href;

  if (!href) return null;

  const enterFullScreen = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    // Focus follows, so the keyboard reaches the app at once.
    iframe.requestFullscreen().then(
      () => iframe.focus(),
      () => {},
    );
  };

  return (
    <div className={styles.embed}>
      <div className={styles.desktop}>
        <div className={styles.screen}>
          <MediaSkeleton ready={ready} />
          {desktop && (
            <iframe
              ref={iframeRef}
              className={styles.iframe}
              data-ready={ready || undefined}
              src={href}
              title={tCases(cover.title)}
              loading="lazy"
              allow="microphone"
              sandbox={SANDBOX}
              onLoad={() => setReady(true)}
            />
          )}
        </div>
        {canFullScreen && (
          <button
            type="button"
            className={styles.fullScreen}
            aria-label={t('fullScreen', { title })}
            onClick={enterFullScreen}
          >
            <ExpandIcon />
          </button>
        )}
      </div>

      <div className={styles.mobile}>
        <WorkMedia media={cover.fallback} alt={tCases(cover.fallbackAlt)} eager />
        <a
          className={`hover-link ${styles.open} text-body-m`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('openAppLabel', { title })}
        >
          {t('openApp')}
          <LinkIcon />
        </a>
      </div>
    </div>
  );
}
