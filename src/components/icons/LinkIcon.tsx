import type { SVGProps } from 'react';

/** Chain link, exported from Figma (link-icon, 439:441). 24 px, stroke only. */
export function LinkIcon(props: SVGProps<SVGSVGElement>) {
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
      <g
        transform="translate(2 2)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.5443 8.4563C10.7249 7.63802 9.61429 7.17841 8.4563 7.17841C7.29831 7.17841 6.18766 7.63802 5.3683 8.4563L2.2793 11.5443C1.46018 12.3634 1 13.4744 1 14.6328C1 15.7912 1.46018 16.9022 2.2793 17.7213C3.09842 18.5404 4.20939 19.0006 5.3678 19.0006C6.52621 19.0006 7.63718 18.5404 8.4563 17.7213L10.0003 16.1773" />
        <path d="M8.4563 11.5443C9.27566 12.3626 10.3863 12.8222 11.5443 12.8222C12.7023 12.8222 13.8129 12.3626 14.6323 11.5443L17.7213 8.4563C18.5404 7.63718 19.0006 6.52621 19.0006 5.3678C19.0006 4.20939 18.5404 3.09842 17.7213 2.2793C16.9022 1.46018 15.7912 1 14.6328 1C13.4744 1 12.3634 1.46018 11.5443 2.2793L10.0003 3.8233" />
      </g>
    </svg>
  );
}
