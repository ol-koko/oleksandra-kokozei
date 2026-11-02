import type { CSSProperties, ReactNode } from 'react';
import styles from './TokenTable.module.css';

export type TokenTableRow = {
  id: string;
  /** The token or style name (16 px). */
  name: string;
  /** What it is for (14 px). */
  note?: string;
  /** The literal value, right-aligned at the end of the row (16 px). */
  value: string;
  /** A first column with the specimen (swatch, bar, text sample); without it the name comes first. */
  sample?: ReactNode;
};

type TokenTableProps = {
  /** Names the table for screen readers. */
  label: string;
  rows: readonly TokenTableRow[];
};

/**
 * The one table of the page (Figma 777:1527, 781:1574): every row is a 200 px
 * first column, a flexible name column (the name over what it is for) and a 72 px
 * value column that ends at the right edge of the row divider. Colors, typography,
 * spacing, border width, blur and durations all use it.
 */
export function TokenTable({ label, rows }: TokenTableProps) {
  const hasSample = rows.some((row) => row.sample !== undefined);

  return (
    <table className={styles.table}>
      <caption className="visually-hidden">{label}</caption>
      <thead className="visually-hidden">
        <tr>
          {hasSample && <th scope="col">Sample</th>}
          <th scope="col">Token</th>
          {!hasSample && <th scope="col">Used for</th>}
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className={styles.row}>
            {hasSample && (
              <td className={styles.sample} aria-hidden="true">
                {row.sample}
              </td>
            )}
            <th scope="row" className={styles.name}>
              <span className={`${styles.token} text-body-m`}>{row.name}</span>
              {hasSample && row.note && (
                <span className={`${styles.note} text-body-xs`}>{row.note}</span>
              )}
            </th>
            {!hasSample && (
              <td className={`${styles.note} text-body-xs`}>{row.note}</td>
            )}
            <td className={`${styles.value} text-body-m`}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type TokenSampleProps = {
  /** `bar`: as wide as the token (spacing). `swatch`: the color. */
  kind: 'bar' | 'swatch';
  /** Token name without `--`. */
  token: string;
};

/** The first-column specimen of a token row, drawn with the token itself. */
export function TokenSample({ kind, token }: TokenSampleProps) {
  return (
    <span
      className={styles[kind]}
      style={{ '--token-value': `var(--${token})` } as CSSProperties}
    />
  );
}
