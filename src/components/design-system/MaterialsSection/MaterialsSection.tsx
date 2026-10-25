import { MaterialSpecimen } from './MaterialSpecimen';
import { Section } from '@/components/design-system/Section/Section';
import { TokenTable } from '@/components/design-system/TokenTable/TokenTable';
import { materials } from '@/content/designSystem';
import type { DesignSystemData } from '@/features/design-system/designSystemData';
import styles from './MaterialsSection.module.css';

/** Materials (Figma 798:1187): media, loading, signature, fades, scrim, sand and the component legend. */
export function MaterialsSection({
  otherGradients,
}: {
  otherGradients: DesignSystemData['other']['gradient'];
}) {
  return (
    <Section id="materials" title="Materials" compact>
      <div className={styles.grid}>
        {materials.map((material) => (
          <MaterialSpecimen key={material.id} {...material} />
        ))}
      </div>
      {otherGradients.length > 0 && <TokenTable label="Other gradient tokens" rows={otherGradients} />}
    </Section>
  );
}
