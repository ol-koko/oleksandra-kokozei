import { Section } from '@/components/design-system/Section/Section';
import { TokenTable } from '@/components/design-system/TokenTable/TokenTable';
import type { TokenRow } from '@/features/design-system/designSystemData';

/** Spacing (Figma 752:2697): a bar as wide as each `--spacing-*` token. */
export function SpacingSection({ rows }: { rows: readonly TokenRow[] }) {
  return (
    <Section id="spacing" title="Spacing" compact>
      <TokenTable label="Spacing tokens" rows={rows} variant="bars" />
    </Section>
  );
}
