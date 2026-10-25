import { BordersSection } from '@/components/design-system/BordersSection/BordersSection';
import { ColorsSection } from '@/components/design-system/ColorsSection/ColorsSection';
import { ComponentsSection } from '@/components/design-system/ComponentsSection/ComponentsSection';
import { DesignSystemNav } from '@/components/design-system/DesignSystemNav/DesignSystemNav';
import { Hero } from '@/components/design-system/Hero/Hero';
import { IconographySection } from '@/components/design-system/IconographySection/IconographySection';
import { MaterialsSection } from '@/components/design-system/MaterialsSection/MaterialsSection';
import { MotionSection } from '@/components/design-system/MotionSection/MotionSection';
import { ShadowsSection } from '@/components/design-system/ShadowsSection/ShadowsSection';
import { SpacingSection } from '@/components/design-system/SpacingSection/SpacingSection';
import { TypographySection } from '@/components/design-system/TypographySection/TypographySection';
import { loadDesignSystemData } from '@/features/design-system/designSystemData';
import styles from './DesignSystemPage.module.css';

/**
 * /design-system: the site's design system as live specimens. Every token,
 * name and value is read from design-system/design-tokens.css at build time,
 * and the specimens are the site's own components, so the page cannot drift.
 */
export async function DesignSystemPage() {
  const data = await loadDesignSystemData();

  return (
    <main id="content" className={styles.main}>
      <DesignSystemNav />
      <div className={styles.column}>
        <Hero />
        <div className={styles.sections}>
          <ColorsSection palettes={data.palettes} />
          <TypographySection typography={data.typography} />
          <ComponentsSection />
          <SpacingSection rows={data.spacing} />
          <BordersSection radius={data.radius} borderWidth={data.borderWidth} />
          <ShadowsSection
            shadows={data.shadows}
            blur={data.blur}
            otherBlur={data.other.blur}
          />
          <IconographySection sizes={data.iconSizes} otherSizes={data.other.size} />
          <MotionSection durations={data.durations} otherMotion={data.other.motion} />
          <MaterialsSection otherGradients={data.other.gradient} />
        </div>
      </div>
    </main>
  );
}
