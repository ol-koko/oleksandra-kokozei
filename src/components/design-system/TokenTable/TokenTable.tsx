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
    <table className={styles.table} data-mode={hasSample ? 'sample' : 'plain'}>
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

type TokenSampleProps =
  | {
      /** A bar as wide as the token (spacing). */
      kind: 'bar';
      /** The token's share of the largest one in the table (0 to 1). */
      ratio: number;
      /** The largest token's value (`120px`): the bar column's natural width. */
      max: string;
    }
  | {
      /** The color, drawn with the token. */
      kind: 'swatch';
      /** Token name without `--`. */
      token: string;
    };

/**
 * The first-column specimen of a token row. A bar is a share of a track that is
 * as wide as the largest bar (the value, so each bar is its token's real width)
 * and never wider than the column: on a narrow screen every bar scales down
 * together and the largest one fills the column.
 */
export function TokenSample(props: TokenSampleProps) {
  if (props.kind === 'swatch') {
    return (
      <span
        className={styles.swatch}
        style={{ '--token-value': `var(--${props.token})` } as CSSProperties}
      />
    );
  }

  return (
    <span className={styles.track} style={{ '--bar-max': props.max } as CSSProperties}>
      <span className={styles.bar} style={{ '--ratio': props.ratio } as CSSProperties} />
    </span>
  );
}
