import { Section, Subsection } from '@/components/design-system/Section/Section';
import { typographyCompositions } from '@/content/designSystemNotes';
import type { DesignSystemData, TypeRow } from '@/features/design-system/designSystemData';
import { numberWord } from '@/features/design-system/formatToken';
import styles from './TypographySection.module.css';

type TypographySectionProps = {
  typography: DesignSystemData['typography'];
};

function TypeTable({ label, rows }: { label: string; rows: readonly (TypeRow & { extra?: string })[] }) {
  return (
    <table className={styles.table}>
      <caption className="visually-hidden">{label}</caption>
      <thead className="visually-hidden">
        <tr>
          <th scope="col">Sample</th>
          <th scope="col">Style</th>
          <th scope="col">Size</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name} className={styles.row}>
            <td className={`text-${row.name.replace('-uppercase', '')} ${row.extra ?? ''}`}>
              Text
            </td>
            <th scope="row" className={styles.style}>
              <span className={`${styles.name} text-body-m`}>{row.name}</span>
              <span className={`${styles.note} text-body-xs`}>{row.note}</span>
            </th>
            <td className={`${styles.size} text-body-m`}>{row.fontSize}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Typography (Figma 777:1528): the family and every `.text-*` class, each set in its own style. */
export function TypographySection({ typography }: TypographySectionProps) {
  const { family, weightCount, styles: typeStyles } = typography;
  const body = typeStyles.filter((style) => style.name.startsWith('body-'));
  const titles = typeStyles.flatMap<TypeRow & { extra?: string }>((style) => {
    if (!style.name.startsWith('title-')) return [];
    const composed = typographyCompositions
      .filter((composition) => composition.base === style.name)
      .map((composition) => ({
        ...style,
        name: composition.name,
        note: `${composition.note} · ${composition.base} in capitals`,
        extra: styles.uppercase,
      }));
    return [style, ...composed];
  });

  return (
    <Section
      id="typography"
      title="Typography"
      intro={[
        `One family, ${numberWord(weightCount)} weights, ${numberWord(typeStyles.length)} text styles.`,
        'Each style maps to a utility class in design-tokens.css',
      ]}
    >
      <Subsection id="typography-family" title="Family">
        <div className={styles.family}>
          <span className={`${styles.aa} text-title-l`} aria-hidden="true">
            Aa
          </span>
          <span className="text-body-m">{family}</span>
          <span className={`${styles.weights} text-body-m`}>
            {weightCount} weights
          </span>
        </div>
      </Subsection>

      <Subsection id="typography-scale" title="Scale">
        <Subsection title="Body" muted level="h4">
          <TypeTable label="Body styles" rows={body} />
        </Subsection>
        <Subsection title="Heading" muted level="h4">
          <TypeTable label="Heading styles" rows={titles} />
        </Subsection>
      </Subsection>
    </Section>
  );
}
