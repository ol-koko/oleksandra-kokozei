import type { SVGProps } from 'react';

/**
 * Sun, from Lucide (https://lucide.dev/icons/sun), ISC License,
 * Copyright (c) Lucide Contributors. Inlined, not installed as a dependency.
 */
export function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M12 20v2" />
      <path d="M12 2v2" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m6.34 17.66-1.41 1.41" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
