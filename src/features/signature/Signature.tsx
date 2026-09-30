import type { SVGProps } from 'react';

/**
 * Handwritten signature, exported from Figma (179:772) as a single stroke path,
 * so the Motion stage can draw it on with `stroke-dashoffset`. Decorative: the
 * name is already in the heading.
 */
export function Signature(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="51"
      height="60"
      viewBox="0 0 51.0007 60.0002"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M14.0926 46.2927C14.125 45.06 14.3404 41.6159 14.3257 38.064C14.3222 37.2104 14.0505 36.5914 13.6034 36.4308C10.9181 35.4664 7.86141 42.0135 5.04168 47.0001C1.39078 53.4566 1.15844 56.2312 1.00944 57.3826C0.935613 57.9531 1.33969 58.5081 1.77759 58.7916C2.21549 59.0752 2.79621 59.0738 3.45301 58.7614C4.10981 58.449 4.82509 57.8257 9.41259 51.3191C14.0001 44.8124 22.4381 32.4413 29.8613 22.3997C37.2845 12.3581 43.437 5.02081 46.2093 2.30109C48.9816 -0.418622 48.1872 1.70154 47.5361 3.44408C46.8851 5.18662 46.4015 6.48729 43.4572 12.0054C40.5128 17.5236 35.1222 27.2198 32.2913 31.8862C29.4604 36.5526 29.3525 35.8954 30.0406 32.2987C31.9844 22.1384 33.5306 15.9956 33.089 17.3317C31.942 20.8022 32.191 24.0989 32.3538 29.826C32.3817 30.8066 33.1871 30.7133 34.3412 29.766C40.5447 23.9866 45.395 21.2309 48.3327 21.4273C48.8922 21.7211 49.2513 22.2189 50.0007 22.9853"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
