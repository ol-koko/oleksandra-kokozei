import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PrivateNote } from '@/components/overlay/PrivateNote/PrivateNote';
import { WorkBlocks } from '@/components/overlay/WorkBlocks/WorkBlocks';
import { WorkFacts } from '@/components/overlay/WorkFacts/WorkFacts';
import { WorkLiveLink } from '@/components/overlay/WorkLiveLink/WorkLiveLink';
import { WorkMedia } from '@/components/overlay/WorkMedia/WorkMedia';
import { WorkPhoto } from '@/components/overlay/WorkPhoto/WorkPhoto';
import { Divider } from '@/components/ui/Divider/Divider';
import { Emoji } from '@/components/ui/Emoji/Emoji';
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
 * the cover (captioned when it has one), the optional private note, then the
 * About blocks.
 */
export function WorkIntro({ slug, workCase, headingId }: WorkIntroProps) {
  const tWorks = useTranslations('Works');
  const tCases = useTranslations('WorkCases');
  const title = tWorks(`items.${slug}.title`);
  const year = works.find((work) => work.slug === slug)?.year;
  const liveSite = projectSites.find((site) => site.id === workCase.liveSite);
  const aboutId = `${headingId}-about`;
  const { cover } = workCase;

  return (
    <div className={styles.intro}>
      <div className={styles.header}>
        <div className={styles.identity}>
          <div className={workCase.icon ? styles.top : `${styles.top} ${styles.linkOnly}`}>
            {workCase.icon && (
              <Image
                className={styles.icon}
                src={workCase.icon.src}
                alt=""
                width={workCase.icon.width}
                height={workCase.icon.height}
                loading="eager"
              />
            )}
            {liveSite && (
              <WorkLiveLink
                slug={slug}
                href={liveSite.href}
                title={title}
                app={workCase.liveApp !== undefined}
                className={workCase.liveApp ? `${styles.link} ${styles.appLink}` : styles.link}
              />
            )}
          </div>

          <div className={styles.text}>
            <h2 id={headingId} className="text-title-l">
              {workCase.titleEmoji && (
                <>
                  <Emoji symbol={tCases(workCase.titleEmoji)} />{' '}
                </>
              )}
              {title}
            </h2>
            <p className={`${styles.description} text-body-l`}>{tCases(workCase.description)}</p>
          </div>
        </div>

        {year !== undefined && <WorkFacts facts={workCase.facts} year={year} />}
      </div>

      <Divider />
      {cover.caption ? (
        <WorkPhoto
          media={cover.media}
          logo={cover.logo}
          alt={tCases(cover.alt)}
          caption={tCases(cover.caption)}
          eager
        />
      ) : (
        <WorkMedia media={cover.media} logo={cover.logo} alt={tCases(cover.alt)} eager />
      )}

      {workCase.about.length > 0 && (
        <div className={styles.more}>
          {workCase.privateNote && <PrivateNote targetId={aboutId} />}
          <div id={aboutId} tabIndex={-1} className={styles.about}>
            <WorkBlocks blocks={workCase.about} headingLevel={3} />
          </div>
        </div>
      )}
    </div>
  );
}
