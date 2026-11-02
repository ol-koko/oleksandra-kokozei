import type { CSSProperties } from 'react';
import { PreviewCard } from '@/components/design-system/PreviewCard/PreviewCard';
import { Section, Subsection } from '@/components/design-system/Section/Section';
import { TokenTable } from '@/components/design-system/TokenTable/TokenTable';
import type { DesignSystemData } from '@/features/design-system/designSystemData';
import { BlurSpecimen } from './BlurSpecimen';
import styles from './ShadowsSection.module.css';

type ShadowsSectionProps = Pick<DesignSystemData, 'shadows' | 'blur' | 'otherBlur'>;

/** Shadows and Blur (Figma 777:1529). */
export function ShadowsSection({ shadows, blur, otherBlur }: ShadowsSectionProps) {
  return (
    <Section id="shadows" title="Shadows">
      <div className={styles.grid}>
        {shadows.map((row) => (
          <PreviewCard
            key={row.token}
            title={row.token.replace('shadow-', '')}
            caption={row.note}
            css={row.css}
          >
            <span
              className={styles.box}
              style={{ '--shadow': `var(--${row.token})` } as CSSProperties}
            />
          </PreviewCard>
        ))}
      </div>

      <Subsection id="shadows-blur" title="Blur">
        <div className={styles.grid}>
          {blur.map((row) => (
            <PreviewCard
              key={row.token}
              title={row.token}
              caption={row.note}
              css={row.css}
            >
              <BlurSpecimen token={row.token} />
            </PreviewCard>
          ))}
        </div>
        {otherBlur.length > 0 && (
          <TokenTable
            label="Other blur tokens"
            rows={otherBlur.map((row) => ({
              id: row.token,
              name: row.token,
              note: row.note,
              value: row.value,
            }))}
          />
        )}
      </Subsection>
    </Section>
  );
}
