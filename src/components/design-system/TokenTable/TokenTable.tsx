import type { CSSProperties } from 'react';
import type { TokenRow } from '@/features/design-system/designSystemData';
import styles from './TokenTable.module.css';

type TokenTableProps = {
  /** Names the table for screen readers. */
  label: string;
  rows: readonly TokenRow[];
  /**
   * `bars`: a bar as wide as the token (spacing). `border`: a box with that
   * border width. `plain`: name, note, value only.
   */
  variant?: 'bars' | 'border' | 'plain';
  /** Header for the note column. */
  noteLabel?: string;
};

/** Token rows as a table (Figma 748:2337, 781:1574): the preview, the token name, what it is for, its value. */
export function TokenTable({ label, rows, variant = 'plain', noteLabel = 'Usage' }: TokenTableProps) {
  const hasPreview = variant !== 'plain';

  return (
    <table className={`${styles.table} ${styles[variant]}`}>
      <caption className="visually-hidden">{label}</caption>
      <thead className="visually-hidden">
        <tr>
          {hasPreview && <th scope="col">Preview</th>}
          <th scope="col">Token</th>
          <th scope="col">{noteLabel}</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.token} className={styles.row}>
            {hasPreview && (
              <td className={styles.preview} aria-hidden="true">
                {variant === 'bars' ? (
                  <span
                    className={styles.bar}
                    style={{ '--token-value': `var(--${row.token})` } as CSSProperties}
                  />
                ) : (
                  <span
                    className={styles.line}
                    style={{ '--token-value': `var(--${row.token})` } as CSSProperties}
                  />
                )}
              </td>
            )}
            <th scope="row" className={`${styles.token} text-body-m`}>
              {row.token}
            </th>
            <td className={`${styles.note} ${variant === 'plain' ? 'text-body-xs' : 'text-body-m'}`}>
              {row.note}
            </td>
            <td className={`${styles.value} ${variant === 'plain' ? 'text-body-xs' : 'text-body-m'}`}>
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
