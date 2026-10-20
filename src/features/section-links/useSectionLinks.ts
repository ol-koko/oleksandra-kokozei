'use client';

import { useEffect } from 'react';
import { isPointerClick } from '@/features/focus/moveFocus';
import {
  isSectionId,
  notifySectionNavigate,
  scrollToSection,
  sectionLinkTarget,
} from './sectionLinks';

/**
 * Keeps the address bar clean of section hashes. Nav links stay real anchors
 * (`href="#works"`), so they work without JavaScript; with it, a plain click
 * scrolls there without adding a hash or a history entry. An incoming hash
 * (`/uk#experience`, the language switcher) still scrolls to its section on
 * load, natively, and is then removed in place.
 *
 * The listener sits on the document, after React's own: an overlay handles
 * its links first (close, then scroll) and marks the click as handled.
 */
export function useSectionLinks() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && isSectionId(id)) {
      // The browser has already started scrolling to the fragment (below the sticky header);
      // removing the hash does not stop it.
      notifySectionNavigate(id);
      const url = new URL(window.location.href);
      url.hash = '';
      // Next.js syncs native `replaceState` with its router; no history entry is added.
      window.history.replaceState(null, '', url);
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = sectionLinkTarget(event.target);
      if (!target) return;
      event.preventDefault();
      scrollToSection(target, { fromPointer: isPointerClick(event) });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
