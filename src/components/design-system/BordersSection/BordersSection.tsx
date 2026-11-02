import type { CSSProperties } from 'react';
import { PreviewCard } from '@/components/design-system/PreviewCard/PreviewCard';
import { Section, Subsection } from '@/components/design-system/Section/Section';
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
              css={row.css}
            >
              <span
                className={styles.box}
                style={{ '--radius': `var(--${row.token})` } as CSSProperties}
              />
            </PreviewCard>
          ))}
        </div>
      </Subsection>

      <Subsection id="borders-width" title="Width">
        <table className={styles.widths}>
          <caption className="visually-hidden">Border width tokens</caption>
          <thead className="visually-hidden">
            <tr>
              <th scope="col">Line</th>
              <th scope="col">Token</th>
              <th scope="col">Used for</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {borderWidth.map((row) => (
              <tr key={row.token} className={styles.width}>
                <td className={styles.preview} aria-hidden="true">
                  <span
                    className={styles.line}
                    style={{ '--border': `var(--${row.token})` } as CSSProperties}
                  />
                </td>
                <th scope="row" className={`${styles.token} text-body-xs`}>
                  {row.token}
                </th>
                <td className={`${styles.note} text-body-xs`}>{row.note}</td>
                <td className={`${styles.value} text-body-xs`}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Subsection>
    </Section>
  );
}
