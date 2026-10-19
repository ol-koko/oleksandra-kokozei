import { useTranslations } from 'next-intl';
import { WorkPhoto } from '@/components/overlay/WorkPhoto/WorkPhoto';
import { WorkPhotoGrid } from '@/components/overlay/WorkPhotoGrid/WorkPhotoGrid';
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

/** Case study blocks in reading order: text blocks, captioned photos and photo grids. */
export function WorkBlocks({ blocks, headingLevel, headingId }: WorkBlocksProps) {
  const t = useTranslations('WorkCases');

  return (
    <div className={styles.blocks}>
      {blocks.map((block, index) =>
        block.kind === 'photo' ? (
          <WorkPhoto
            key={block.copy}
            media={block.image}
            alt={t(`${block.copy}.alt`)}
            caption={t(`${block.copy}.caption`)}
          />
        ) : block.kind === 'photo-grid' ? (
          <WorkPhotoGrid key={block.photos[0]?.copy ?? index} photos={block.photos} />
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
