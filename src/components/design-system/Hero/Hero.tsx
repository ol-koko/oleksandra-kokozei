import { SandText } from '@/components/layout/Logo/SandText';
import {
  designSystemDomain,
  designSystemSummary,
  designSystemTitle,
} from '@/content/designSystem';
import styles from './Hero.module.css';

/**
 * Overview (Figma 730:1615): the page title, the domain written in sand that
 * plays when the page opens and then every 10 seconds while it is on screen,
 * and a line about what the page holds.
 */
export function Hero() {
  return (
    <section id="overview" tabIndex={-1} aria-labelledby="overview-title" className={styles.hero}>
      <div className={styles.title}>
        <h1 id="overview-title" className={`${styles.heading} text-title-l`}>
          {designSystemTitle}
        </h1>
        <p className={`${styles.domain} text-title-s`}>
          <SandText text={designSystemDomain} placement="design-system" />
        </p>
      </div>
      <p className={`${styles.summary} text-body-l`}>{designSystemSummary}</p>
    </section>
  );
}
