import type { SVGProps } from 'react';

/** Location pin, exported from Figma (hero, 5:83). 16 px, stroke only. */
export function LocationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M8 8.95333C9.14875 8.95333 10.08 8.02209 10.08 6.87333C10.08 5.72458 9.14875 4.79333 8 4.79333C6.85125 4.79333 5.92 5.72458 5.92 6.87333C5.92 8.02209 6.85125 8.95333 8 8.95333Z"
        stroke="currentColor"
      />
      <path
        d="M2.41333 5.66C3.72667 -0.113333 12.28 -0.106666 13.5867 5.66667C14.3533 9.05333 12.2467 11.92 10.4 13.6933C9.06 14.9867 6.94 14.9867 5.59333 13.6933C3.75333 11.92 1.64667 9.04667 2.41333 5.66Z"
        stroke="currentColor"
      />
    </svg>
  );
}
