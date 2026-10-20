import type { ResolvingMetadata } from 'next';
import { meMetadata } from '@/features/overlay/overlayMetadata';
import HomePage from '../page';

export function generateMetadata(_props: PageProps<'/[locale]/me'>, parent: ResolvingMetadata) {
  return meMetadata(parent);
}

/** `/me`: the page with overlay-me open (`OverlayHost` reads the path). */
export default HomePage;
