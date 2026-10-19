'use client';

import { useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';
import { ArrowUpRightIcon } from '@/components/icons/ArrowUpRightIcon';
import { LinkIcon } from '@/components/icons/LinkIcon';
import type { WorkSlug } from '@/content/types';
import { isPointerClick } from '@/features/focus/moveFocus';
import { openApp } from '@/features/overlay/overlayRoute';
import { useMediaQuery } from '@/features/motion/useMediaQuery';

/** Where the app overlay opens. Keep in sync with the desktop overlay in Overlay.module.css. */
const DESKTOP_QUERY = '(min-width: 768px)';

type WorkLiveLinkProps = {
  slug: WorkSlug;
  href: string;
  /** The work title, for the accessible name. */
  title: string;
  /** The live site is an app (`liveApp`): on desktop it opens in an overlay instead of a new tab. */
  app: boolean;
  className?: string;
};

/**
 * The live-site link in a case header. A live app opens in the app overlay on
 * desktop; everywhere else, and for a modified click, the link opens a new tab.
 */
export function WorkLiveLink({ slug, href, title, app, className }: WorkLiveLinkProps) {
  const t = useTranslations('Overlay.work');
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const inOverlay = app && desktop;

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!inOverlay || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    event.preventDefault();
    openApp({ kind: 'work', slug }, { fromPointer: isPointerClick(event) });
  };

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={inOverlay ? t('openApp', { title }) : t('openLiveSite', { title })}
      aria-haspopup={inOverlay ? 'dialog' : undefined}
      data-app-trigger={app ? slug : undefined}
      onClick={onClick}
    >
      {app ? <ArrowUpRightIcon /> : <LinkIcon />}
    </a>
  );
}
