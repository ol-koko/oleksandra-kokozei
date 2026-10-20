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

/**
 * Case study blocks in reading order: text blocks, captioned photos and photo
 * grids. Each block reveals on scroll on its own.
 */
export function WorkBlocks({ blocks, headingLevel, headingId }: WorkBlocksProps) {
  const t = useTranslations('WorkCases');

  return (
    <div className={styles.blocks}>
      {blocks.map((block, index) => (
        <div key={blockKey(block, index)} className="reveal">
          {block.kind === 'photo' ? (
            <WorkPhoto
              media={block.image}
              alt={t(`${block.copy}.alt`)}
              caption={t(`${block.copy}.caption`)}
            />
          ) : block.kind === 'photo-grid' ? (
            <WorkPhotoGrid photos={block.photos} />
          ) : (
            <WorkStory
              block={block}
              headingLevel={headingLevel}
              headingId={index === 0 ? headingId : undefined}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/** A grid has no copy of its own: it goes by its first photo. */
function blockKey(block: WorkBlock, index: number) {
  return block.kind === 'photo-grid' ? (block.photos[0]?.copy ?? String(index)) : block.copy;
}
