import { sectionIds } from '@/content/navigation';
import type { SectionId } from '@/content/types';
import { moveFocus } from '@/features/focus/moveFocus';
import { scrollBehavior } from '@/features/motion/scrollBehavior';

type SectionListener = (id: SectionId) => void;

const listeners = new Set<SectionListener>();

export function isSectionId(value: string): value is SectionId {
  return (sectionIds as readonly string[]).includes(value);
}

/** The page section an in-page link points to (`href="#works"`), if the click hit one. */
export function sectionLinkTarget(target: EventTarget | null): SectionId | undefined {
  if (!(target instanceof Element)) return undefined;
  const id = target.closest('a[href^="#"]')?.getAttribute('href')?.slice(1);
  return id && isSectionId(id) ? id : undefined;
}

/** Subscribes to section navigations (the scroll-spy keeps the target active while scrolling). */
export function onSectionNavigate(listener: SectionListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Tells subscribers the page is heading to a section. */
export function notifySectionNavigate(id: SectionId) {
  listeners.forEach((listener) => listener(id));
}

/**
 * Scrolls the page to a section without putting a hash in the URL. Focus
 * moves to the section once no modal layer is open (a closing menu keeps the
 * page inert until it has closed).
 */
export function scrollToSection(id: SectionId, { fromPointer }: { fromPointer: boolean }) {
  const section = document.getElementById(id);
  if (!section) return;
  notifySectionNavigate(id);
  section.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });

  const focusSection = () => moveFocus(section, { fromPointer, preventScroll: true });
  const modal = document.querySelector('dialog:modal');
  if (modal) modal.addEventListener('close', focusSection, { once: true });
  else focusSection();
}
