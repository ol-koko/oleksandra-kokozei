import { appRouteParams } from '@/features/overlay/overlayRoute';

export const dynamicParams = false;

export function generateStaticParams() {
  return appRouteParams();
}

/** `/works/<slug>/app` opened from its case: the page and the case stay mounted. */
export default function AppModal() {
  return null;
}
