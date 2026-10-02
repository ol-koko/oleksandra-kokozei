import { ExperienceSection } from '@/components/sections/ExperienceSection/ExperienceSection';
import { HeroSection } from '@/components/sections/HeroSection/HeroSection';
import { WorksSection } from '@/components/sections/WorksSection/WorksSection';
import { Divider } from '@/components/ui/Divider/Divider';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main id="content" className={styles.main}>
      <HeroSection />
      <Divider className={styles.divider} />
      <WorksSection />
      <Divider className={styles.divider} />
      <ExperienceSection />
    </main>
  );
}
