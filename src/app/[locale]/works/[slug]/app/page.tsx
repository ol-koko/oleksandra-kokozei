import { appRouteParams } from '@/features/overlay/overlayRoute';
import HomePage from '../../../page';

/** Only works with a live app have this route. */
export const dynamicParams = false;

export function generateStaticParams() {
  return appRouteParams();
}

/** `/works/<slug>/app`: the page with the case and, on desktop, its live app open. */
export default HomePage;
