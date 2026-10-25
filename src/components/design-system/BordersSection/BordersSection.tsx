import type { CSSProperties } from 'react';
import { PreviewCard } from '@/components/design-system/PreviewCard/PreviewCard';
import { Section, Subsection } from '@/components/design-system/Section/Section';
import { TokenTable } from '@/components/design-system/TokenTable/TokenTable';
import type { TokenRow } from '@/features/design-system/designSystemData';
import styles from './BordersSection.module.css';

type BordersSectionProps = {
  radius: readonly TokenRow[];
  borderWidth: readonly TokenRow[];
};

/** Borders (Figma 752:2695): every `--border-radius-*` on a box, then the border widths. */
export function BordersSection({ radius, borderWidth }: BordersSectionProps) {
  return (
    <Section id="borders" title="Borders">
      <Subsection id="borders-radius" title="Radius">
        <div className={styles.grid}>
          {radius.map((row) => (
            <PreviewCard
              key={row.token}
              title={row.token.replace('border-', '')}
              caption={row.note}
              code={`--${row.token}: ${row.value}`}
            >
              <span
                className={styles.box}
                style={{ '--radius': `var(--${row.token})` } as CSSProperties}
              />
            </PreviewCard>
          ))}
        </div>
      </Subsection>

      <Subsection title="Border width">
        <TokenTable label="Border width tokens" rows={borderWidth} variant="border" />
      </Subsection>
    </Section>
  );
}
