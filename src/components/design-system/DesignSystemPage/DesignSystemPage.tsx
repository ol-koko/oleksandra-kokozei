import { getTranslations } from 'next-intl/server';
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
import { Breadcrumbs } from '@/components/overlay/Breadcrumbs/Breadcrumbs';
import { designSystemCrumb } from '@/content/designSystem';
import { loadDesignSystemData } from '@/features/design-system/designSystemData';
import styles from './DesignSystemPage.module.css';

/**
 * /design-system: the site's design system as live specimens. Every token,
 * name and value is read from design-system/design-tokens.css at build time,
 * and the specimens are the site's own components, so the page cannot drift.
 */
export async function DesignSystemPage() {
  const data = await loadDesignSystemData();
  const t = await getTranslations('Common');

  return (
    <>
      {/* In the header's place (Figma 730:1626 is replaced by the breadcrumbs). */}
      <div className={styles.bar}>
        <Breadcrumbs parentLabel={t('name')} parentHref="/" current={designSystemCrumb} />
      </div>
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
            otherBlur={data.otherBlur}
          />
          <IconographySection sizes={data.iconSizes} />
          <MotionSection durations={data.durations} />
          <MaterialsSection />
        </div>
      </div>
      </main>
    </>
  );
}
