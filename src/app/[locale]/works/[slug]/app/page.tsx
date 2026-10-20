import type { ResolvingMetadata } from 'next';
import { workMetadata } from '@/features/overlay/overlayMetadata';
import { appRouteParams } from '@/features/overlay/overlayRoute';
import HomePage from '../../../page';

/** Only works with a live app have this route. */
export const dynamicParams = false;

export function generateStaticParams() {
  return appRouteParams();
}

export async function generateMetadata(
  { params }: PageProps<'/[locale]/works/[slug]/app'>,
  parent: ResolvingMetadata,
) {
  return workMetadata((await params).slug, parent);
}

/** `/works/<slug>/app`: the page with the case and, on desktop, its live app open. */
export default HomePage;
