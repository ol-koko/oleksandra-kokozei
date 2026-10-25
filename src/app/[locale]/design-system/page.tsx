import type { ResolvingMetadata } from 'next';
import { DesignSystemPage } from '@/components/design-system/DesignSystemPage/DesignSystemPage';
import { designSystemMetadata } from '@/features/design-system/designSystemMetadata';

export function generateMetadata(
  _props: PageProps<'/[locale]/design-system'>,
  parent: ResolvingMetadata,
) {
  return designSystemMetadata(parent);
}

/** `/design-system`: the design system as live specimens. Static, under every locale prefix. */
export default DesignSystemPage;
