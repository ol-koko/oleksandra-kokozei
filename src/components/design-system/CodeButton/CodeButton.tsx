'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CodeButton.module.css';

/** How long "Copied" stays on screen. */
const COPIED_MS = 1600;

type CodeButtonProps = {
  /** The CSS that is copied. */
  css: string;
  /** What the CSS is for: the specimen's name, in the button's name. */
  label: string;
};

/** Copies text, with a fallback for pages without the async clipboard (insecure origins). */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  }
}

/**
 * The `</>` mark of a specimen card (Figma 752:2705) as a button: it copies the
 * specimen's CSS. It hovers like the site's links (nav-link). "Copy CSS" is a
 * tooltip for pointer hover and keyboard focus only; "Copied" shows after a copy
 * on every device and is announced by a live region.
 */
export function CodeButton({ css, label }: CodeButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    if (!(await copyText(css))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  }

  return (
    <>
      <button
        type="button"
        className={`nav-link ${styles.button} text-body-xs`}
        aria-label={`Copy CSS for ${label}`}
        data-copied={copied ? '' : undefined}
        onClick={copy}
      >
        <span aria-hidden="true">{'</>'}</span>
        {/* Two bubbles, so the hint never appears while "Copied" fades out after a tap. */}
        <span className={`social-label ${styles.hint}`} aria-hidden="true">
          Copy CSS
        </span>
        <span className={`social-label ${styles.done}`} aria-hidden="true">
          Copied
        </span>
      </button>
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied ? `CSS for ${label} copied` : ''}
      </span>
    </>
  );
}
