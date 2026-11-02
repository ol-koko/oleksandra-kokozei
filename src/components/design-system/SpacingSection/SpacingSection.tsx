import { Section } from '@/components/design-system/Section/Section';
import { TokenSample, TokenTable } from '@/components/design-system/TokenTable/TokenTable';
import type { TokenRow } from '@/features/design-system/designSystemData';

/** Spacing (Figma 752:2697): a bar as wide as each `--spacing-*` token. */
export function SpacingSection({ rows }: { rows: readonly TokenRow[] }) {
  return (
    <Section id="spacing" title="Spacing" compact>
      <TokenTable
        label="Spacing tokens"
        rows={rows.map((row) => ({
          id: row.token,
          name: row.token,
          note: row.note,
          value: row.value,
          sample: <TokenSample kind="bar" token={row.token} />,
        }))}
      />
    </Section>
  );
}
