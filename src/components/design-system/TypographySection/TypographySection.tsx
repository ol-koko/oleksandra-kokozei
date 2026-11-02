import { Section, Subsection } from '@/components/design-system/Section/Section';
import { TokenTable, type TokenTableRow } from '@/components/design-system/TokenTable/TokenTable';
import { typographyCompositions } from '@/content/designSystemNotes';
import type { DesignSystemData, TypeRow } from '@/features/design-system/designSystemData';
import { numberWord } from '@/features/design-system/formatToken';
import styles from './TypographySection.module.css';

type TypographySectionProps = {
  typography: DesignSystemData['typography'];
};

function typeRow(row: TypeRow, composed?: { name: string; note: string }): TokenTableRow {
  return {
    id: composed?.name ?? row.name,
    name: composed?.name ?? row.name,
    note: composed?.note ?? row.note,
    value: row.fontSize,
    sample: (
      <span className={`text-${row.name} ${composed ? styles.uppercase : ''}`}>
        {composed ? 'Text'.toUpperCase() : 'Text'}
      </span>
    ),
  };
}

/** Typography (Figma 777:1528): the family and every `.text-*` class, each set in its own style. */
export function TypographySection({ typography }: TypographySectionProps) {
  const { family, weightCount, styles: typeStyles } = typography;
  const body = typeStyles.filter((style) => style.name.startsWith('body-')).map((row) => typeRow(row));
  const titles = typeStyles
    .filter((style) => style.name.startsWith('title-'))
    .flatMap((style) => [
      typeRow(style),
      ...typographyCompositions
        .filter((composition) => composition.base === style.name)
        .map((composition) =>
          typeRow(style, {
            name: composition.name,
            note: `${composition.note} · ${composition.base} in capitals`,
          }),
        ),
    ]);

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
          <span className={`${styles.weights} text-body-m`}>{weightCount} weights</span>
        </div>
      </Subsection>

      <Subsection id="typography-scale" title="Scale">
        <Subsection title="Body" muted level="h4">
          <TokenTable label="Body styles" rows={body} />
        </Subsection>
        <Subsection title="Heading" muted level="h4">
          <TokenTable label="Heading styles" rows={titles} />
        </Subsection>
      </Subsection>
    </Section>
  );
}
