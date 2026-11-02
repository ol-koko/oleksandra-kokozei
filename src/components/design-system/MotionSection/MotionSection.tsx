import { Section, Subsection } from '@/components/design-system/Section/Section';
import { TokenTable } from '@/components/design-system/TokenTable/TokenTable';
import { animations, hovers } from '@/content/designSystem';
import type { DesignSystemData } from '@/features/design-system/designSystemData';
import { AnimationSpecimen, HoverSpecimen } from './Specimens';
import styles from './MotionSection.module.css';

type MotionSectionProps = {
  durations: DesignSystemData['durations'];
};

/**
 * Motion (Figma 786:1625): every animation class of animations.css and every
 * hover rule of hover.css, looping on its own; then the duration scale.
 */
export function MotionSection({ durations }: MotionSectionProps) {
  return (
    <Section id="motion" title="Motion">
      <Subsection id="motion-animation" title="Animation">
        <div className={styles.grid}>
          {animations.map((animation) => (
            <AnimationSpecimen key={animation.id} {...animation} />
          ))}
        </div>
      </Subsection>

      <Subsection id="motion-hover" title="Hover">
        <div className={styles.grid}>
          {hovers.map((hover) => (
            <HoverSpecimen key={hover.id} {...hover} />
          ))}
        </div>
      </Subsection>

      <Subsection id="motion-duration" title="Duration scale">
        <TokenTable
          label="Duration tokens"
          rows={durations.map((row) => ({
            id: row.token,
            name: row.token,
            note: row.note,
            value: row.value,
          }))}
        />
      </Subsection>
    </Section>
  );
}
