import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LinkIcon } from '@/components/icons/LinkIcon';
import { PrivateNote } from '@/components/overlay/PrivateNote/PrivateNote';
import { WorkBlocks } from '@/components/overlay/WorkBlocks/WorkBlocks';
import { WorkFacts } from '@/components/overlay/WorkFacts/WorkFacts';
import { WorkMedia } from '@/components/overlay/WorkMedia/WorkMedia';
import { Divider } from '@/components/ui/Divider/Divider';
import { projectSites } from '@/content/links';
import type { WorkCase, WorkSlug } from '@/content/types';
import { works } from '@/content/works';
import styles from './WorkIntro.module.css';

type WorkIntroProps = {
  slug: WorkSlug;
  workCase: WorkCase;
  /** Id of the work title, which names the About section. */
  headingId: string;
};

/**
 * The About section of a work overlay (Figma 448:534, mobile 520:1036): icon,
 * title, description and facts, a link to the live site when there is one,
 * the cover, the optional private note, then the About blocks.
 */
export function WorkIntro({ slug, workCase, headingId }: WorkIntroProps) {
  const t = useTranslations('Overlay.work');
  const tWorks = useTranslations('Works');
  const tCases = useTranslations('WorkCases');
  const title = tWorks(`items.${slug}.title`);
  const year = works.find((work) => work.slug === slug)?.year;
  const liveSite = projectSites.find((site) => site.id === workCase.liveSite);
  const aboutId = `${headingId}-about`;

  return (
    <div className={styles.intro}>
      <div className={styles.header}>
        <div className={styles.identity}>
          <div className={styles.top}>
            <Image
              className={styles.icon}
              src={workCase.icon.src}
              alt=""
              width={workCase.icon.width}
              height={workCase.icon.height}
              loading="eager"
            />
            {liveSite && (
              <a
                className={styles.link}
                href={liveSite.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('openLiveSite', { title })}
              >
                <LinkIcon />
              </a>
            )}
          </div>

          <div className={styles.text}>
            <h2 id={headingId} className="text-title-l">
              {title}
            </h2>
            <p className={`${styles.description} text-body-2xs`}>{tCases(workCase.description)}</p>
          </div>
        </div>

        {year !== undefined && <WorkFacts facts={workCase.facts} year={year} />}
      </div>

      <Divider />
      <WorkMedia image={workCase.cover.image} alt={tCases(workCase.cover.alt)} eager />

      <div className={styles.more}>
        {workCase.privateNote && <PrivateNote targetId={aboutId} />}
        <div id={aboutId} tabIndex={-1} className={styles.about}>
          <WorkBlocks blocks={workCase.about} headingLevel={3} />
        </div>
      </div>
    </div>
  );
}
