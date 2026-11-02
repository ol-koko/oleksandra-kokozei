import { MaterialSpecimen } from './MaterialSpecimen';
import { Section } from '@/components/design-system/Section/Section';
import { materials } from '@/content/designSystem';
import styles from './MaterialsSection.module.css';

/** Materials (Figma 798:1187): media, loading, signature, fades, scrim, sand and the component legend. */
export function MaterialsSection() {
  return (
    <Section id="materials" title="Materials" compact>
      <div className={styles.grid}>
        {materials.map((material) => (
          <MaterialSpecimen key={material.id} {...material} />
        ))}
      </div>
    </Section>
  );
}
