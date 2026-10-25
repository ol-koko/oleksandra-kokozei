import type { SVGProps } from 'react';

/** Paint brush, exported from Figma (footer, 831:1599). 24 px, stroke only. */
export function BrushIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M19.69 14.01C19.63 14 19.57 14 19.5 14H4.5C4.43 14 4.37 14 4.31 14.01C3.3 14.11 2.5 14.97 2.5 16C2.5 16.55 2.72 17.05 3.09 17.41C3.45 17.78 3.95 18 4.5 18H9.5V19.5C9.5 20.88 10.62 22 12 22C13.38 22 14.5 20.88 14.5 19.5V18H19.39C20.45 18 21.4 17.23 21.49 16.18C21.54 15.56 21.32 14.99 20.91 14.59C20.59 14.26 20.17 14.05 19.69 14.01ZM4.31 14.01L3.83 5.3C3.65 3.53 5.04 2 6.81 2H17.19C18.96 2 20.35 3.53 20.17 5.3L19.69 14.01M7.99 2V7M12 2V4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
