import { useTranslations } from 'next-intl';
import { Emoji, splitLeadingEmoji } from '@/components/ui/Emoji/Emoji';
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
 * left, then one body or titled topics on the right. Stacked on mobile
 * (520:958).
 */
export function WorkStory({ block, headingLevel, headingId }: WorkStoryProps) {
  const t = useTranslations('WorkCases');
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const TopicHeading = headingLevel === 2 ? 'h3' : 'h4';

  return (
    <div className={styles.story}>
      <div className={styles.intro}>
        <Heading id={headingId} className={`${styles.label} text-title-s`} data-reveal>
          {t(`${block.copy}.label`)}
        </Heading>
        <p className={`${styles.lead} text-title-s`} data-reveal>
          {t(`${block.copy}.lead`)}
        </p>
      </div>

      {block.kind === 'story' ? (
        <StoryBody text={t(`${block.copy}.body`)} reveal />
      ) : (
        <div className={styles.topics}>
          {block.topics.map((topic) => (
            <div key={topic} className={styles.topic} data-reveal>
              <TopicHeading className="text-body-m">
                <TopicTitle text={t(`${topic}.title`)} />
              </TopicHeading>
              <StoryBody text={t(`${topic}.body`)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** A topic title; a leading emoji is decorative, so the title is read once. */
function TopicTitle({ text }: { text: string }) {
  const title = splitLeadingEmoji(text);
  return (
    <>
      {title.emoji && (
        <>
          <Emoji symbol={title.emoji} />{' '}
        </>
      )}
      {title.text}
    </>
  );
}

const LIST_MARKER = '- ';

/**
 * A body message: each line is a paragraph; an empty line adds a gap, as in
 * Figma. Consecutive lines starting with `- ` form one bulleted list. Fades
 * up on its own unless it sits in a topic that does.
 */
function StoryBody({ text, reveal = false }: { text: string; reveal?: boolean }) {
  return (
    <div className={styles.body} data-reveal={reveal || undefined}>
      {text.split('\n\n').map((run) => (
        <div key={run}>
          {groupLines(run.split('\n')).map((group) =>
            typeof group === 'string' ? (
              <p key={group} className="text-body-s">
                {group}
              </p>
            ) : (
              <ul key={group.join('\n')} className={styles.list}>
                {group.map((item) => (
                  <li key={item} className="text-body-s">
                    {item}
                  </li>
                ))}
              </ul>
            ),
          )}
        </div>
      ))}
    </div>
  );
}

/** Paragraphs stay strings; runs of list lines become one array of items, without the marker. */
function groupLines(lines: readonly string[]): (string | string[])[] {
  const groups: (string | string[])[] = [];
  for (const line of lines) {
    if (!line.startsWith(LIST_MARKER)) {
      groups.push(line);
      continue;
    }
    const item = line.slice(LIST_MARKER.length);
    const last = groups.at(-1);
    if (Array.isArray(last)) last.push(item);
    else groups.push([item]);
  }
  return groups;
}
