'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { MenuToggleIcon } from '@/components/icons/MenuToggleIcon';
import { designSystemAnchorIds, designSystemNav } from '@/content/designSystem';
import { isPointerClick } from '@/features/focus/moveFocus';
import { useScrollSpy } from '@/features/scroll-spy/useScrollSpy';
import { scrollToSection } from '@/features/section-links/sectionLinks';
import styles from './DesignSystemNav.module.css';

const labels = new Map<string, string>(
  designSystemNav.flatMap((item) => [
    [item.id, item.label] as const,
    ...('children' in item ? item.children.map((child) => [child.id, child.label] as const) : []),
  ]),
);

/**
 * The page's own menu (Figma 730:1540). Desktop: a sticky column; items with
 * sub-items open on hover, on keyboard focus and on click, and stay open while
 * their section is in view. Below 1024: a bar under the site header with the
 * current section and a menu button that opens the same list full width.
 * Links scroll smoothly without adding a hash to the address.
 */
export function DesignSystemNav() {
  const activeId = useScrollSpy(designSystemAnchorIds);
  const [pinnedId, setPinnedId] = useState<string>();
  const [menuOpen, setMenuOpen] = useState(false);
  const listId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setMenuOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu(true);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  /*
   * The open panel never exceeds the screen: its height is what is left below
   * its top edge wherever the page is scrolled to, and the list scrolls inside.
   */
  useEffect(() => {
    if (!menuOpen) return;
    const fit = () => {
      const list = listRef.current;
      if (!list) return;
      const space = window.innerHeight - list.getBoundingClientRect().top;
      list.style.setProperty('--menu-max-block-size', `${space}px`);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [menuOpen]);

  return (
    <nav aria-label="Design system" className={styles.nav} data-reveal>
      <div className={styles.bar}>
        <span className={`${styles.current} text-body-m`}>
          {labels.get(activeId ?? '') ?? designSystemNav[0].label}
        </span>
        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-label={menuOpen ? 'Close design system menu' : 'Open design system menu'}
          aria-expanded={menuOpen}
          aria-controls={listId}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <MenuToggleIcon open={menuOpen} />
        </button>
      </div>

      <ul ref={listRef} id={listId} className={styles.list} data-open={menuOpen ? '' : undefined}>
        {designSystemNav.map((item) => {
          const children = 'children' in item ? item.children : undefined;
          const insideGroup =
            children?.some((child) => child.id === activeId) || item.id === activeId;
          const expanded = Boolean(children) && (pinnedId === item.id || insideGroup);

          return (
            <li key={item.id} className={styles.item} data-expanded={expanded ? '' : undefined}>
              <NavLink
                id={item.id}
                label={item.label}
                activeId={activeId}
                expanded={children ? expanded : undefined}
                onActivate={(fromPointer) => {
                  if (children) setPinnedId(item.id);
                  scrollToSection(item.id, { fromPointer });
                  closeMenu(false);
                }}
              />
              {children && (
                <ul className={styles.sub}>
                  <li className={styles.subInner}>
                    <ul className={styles.subList}>
                      {children.map((child) => (
                        <li key={child.id}>
                          <NavLink
                            id={child.id}
                            label={child.label}
                            activeId={activeId}
                            sub
                            onActivate={(fromPointer) => {
                              scrollToSection(child.id, { fromPointer });
                              closeMenu(false);
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type NavLinkProps = {
  id: string;
  label: string;
  activeId?: string;
  sub?: boolean;
  expanded?: boolean;
  onActivate: (fromPointer: boolean) => void;
};

/** An anchor (`href="#colors"`, so it works without script) that scrolls instead of changing the URL. */
function NavLink({ id, label, activeId, sub = false, expanded, onActivate }: NavLinkProps) {
  return (
    <a
      href={`#${id}`}
      className={`nav-link ${styles.link} ${sub ? styles.sublink : ''} text-title-s`}
      aria-current={id === activeId ? 'true' : undefined}
      aria-expanded={expanded}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        event.preventDefault();
        onActivate(isPointerClick(event));
      }}
    >
      {label}
    </a>
  );
}
