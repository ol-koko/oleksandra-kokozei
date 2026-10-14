import { useTranslations } from 'next-intl';
import type { WorkStoryBlock } from '@/content/types';
import styles from './WorkStory.module.css';

type WorkStoryProps = {
  block: WorkStoryBlock;
  /** 2 when the label heads its section, 3 inside About (under the work title). */
  headingLevel: 2 | 3;
  /** Set on the label when it names the section. */
  headingId?: string;
};

/**
 * A case study text block (Figma "txt-block", 467:660): label and lead on the
 * left, then one body or titled topics on the right. Two columns on mobile
 * too (520:958).
 */
export function WorkStory({ block, headingLevel, headingId }: WorkStoryProps) {
  const t = useTranslations('WorkCases');
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const TopicHeading = headingLevel === 2 ? 'h3' : 'h4';

  return (
    <div className={styles.story}>
      <div className={styles.intro}>
        <Heading id={headingId} className={`${styles.label} text-title-s`}>
          {t(`${block.copy}.label`)}
        </Heading>
        <p className={`${styles.lead} text-title-s`}>{t(`${block.copy}.lead`)}</p>
      </div>

      {block.kind === 'story' ? (
        <StoryBody text={t(`${block.copy}.body`)} />
      ) : (
        <div className={styles.topics}>
          {block.topics.map((topic) => (
            <div key={topic} className={styles.topic}>
              <TopicHeading className="text-body-m">{t(`${topic}.title`)}</TopicHeading>
              <StoryBody text={t(`${topic}.body`)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** A body message: each line is a paragraph; an empty line adds a gap, as in Figma. */
function StoryBody({ text }: { text: string }) {
  return (
    <div className={styles.body}>
      {text.split('\n\n').map((run) => (
        <div key={run}>
          {run.split('\n').map((line) => (
            <p key={line} className="text-body-s">
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
