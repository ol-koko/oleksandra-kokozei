import type { ResolvingMetadata } from 'next';
import { workMetadata } from '@/features/overlay/overlayMetadata';
import { workRouteParams } from '@/features/overlay/overlayRoute';
import HomePage from '../../page';

/** Unpublished works and unknown slugs are a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return workRouteParams();
}

export async function generateMetadata(
  { params }: PageProps<'/[locale]/works/[slug]'>,
  parent: ResolvingMetadata,
) {
  return workMetadata((await params).slug, parent);
}

/** `/works/<slug>`: the page with the work overlay open (`OverlayHost` reads the path). */
export default HomePage;
