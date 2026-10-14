import { WorkPhoto } from '@/components/overlay/WorkPhoto/WorkPhoto';
import { WorkStory } from '@/components/overlay/WorkStory/WorkStory';
import type { WorkBlock } from '@/content/types';
import styles from './WorkBlocks.module.css';

type WorkBlocksProps = {
  blocks: readonly WorkBlock[];
  /** Heading level of the story labels: 2 in a section of their own, 3 inside About. */
  headingLevel: 2 | 3;
  /** Set on the first story label when it names the section. */
  headingId?: string;
};

/** Case study blocks in reading order: text blocks and captioned photos. */
export function WorkBlocks({ blocks, headingLevel, headingId }: WorkBlocksProps) {
  return (
    <div className={styles.blocks}>
      {blocks.map((block, index) =>
        block.kind === 'photo' ? (
          <WorkPhoto key={block.copy} block={block} />
        ) : (
          <WorkStory
            key={block.copy}
            block={block}
            headingLevel={headingLevel}
            headingId={index === 0 ? headingId : undefined}
          />
        ),
      )}
    </div>
  );
}
