import type { MessageKeys, NestedKeyOf } from 'next-intl';
import type messages from '../../messages/en.json';

/** Identifiers for social profiles. Display labels live in messages (`Links.social.*`). */
export type SocialLinkId = 'linkedin' | 'behance' | 'github';

/** Identifiers for live project sites. Display labels live in messages (`Links.projects.*`). */
export type ProjectSiteId = 'filmBudget' | 'blowStressAway';

/** Page sections. Each id is the anchor of a `<section>` on the main page. */
export type SectionId = 'me' | 'works' | 'experience';

export type ExternalLink<Id extends string> = {
  id: Id;
  href: `https://${string}`;
};

/** A local image in `public/`, with its intrinsic size in pixels. */
export type ImageAsset = {
  src: `/media/${string}`;
  width: number;
  height: number;
};

/**
 * A silent looping video in `public/`, encoded twice: AV1 WebM first, H.264
 * MP4 as the fallback. Width and height are its intrinsic size in pixels.
 */
export type VideoAsset = {
  webm: `/media/${string}.webm`;
  mp4: `/media/${string}.mp4`;
  width: number;
  height: number;
};

/** Works on the main page. Title and description live in messages (`Works.items.*`). */
export type WorkSlug = 'ces' | 'juJutsu' | 'blowStressAway' | 'filmBudget';

/** Card cover: a looping video, with the backdrop baked in. */
export type WorkCover = {
  video: VideoAsset;
  /**
   * Logo in the top-right corner, drawn above the video instead of baked in,
   * so it keeps its inset and is never cropped with the video.
   */
  logo?: ImageAsset;
};

export type Work = {
  slug: WorkSlug;
  year: number;
  cover: WorkCover;
  /**
   * Whether the case study is ready. An unpublished work keeps its card on the
   * page, but the card opens nothing and its `?work=` link is ignored.
   */
  published: boolean;
};

/** Paragraph keys of a multi-paragraph message group, in reading order. */
export type ParagraphKey = 'p1' | 'p2' | 'p3';

/** Roles in the Experience section. Copy lives in messages (`Experience.roles.*`). */
export type RoleId = 'independent';

export type Role = {
  id: RoleId;
  paragraphs: readonly ParagraphKey[];
};

/** Sections of overlay-me. Nav labels and headings live in messages (`Overlay.me.sections.*`). */
export type MeOverlaySectionId = 'about' | 'home' | 'music' | 'books' | 'films';

/** Hometown photos in overlay-me. Alt text lives in messages (`Overlay.me.sections.home.photos.*`). */
export type HometownPhotoId = 'port' | 'opera' | 'beach' | 'street';

/** Center of a photo's rotated box inside its area, in px (Figma geometry, stored as data). */
export type PhotoPlacement = { x: number; y: number };

export type HometownPhoto = {
  id: HometownPhotoId;
  image: ImageAsset;
  /** Rotation in degrees, the same on desktop and mobile. */
  rotation: number;
  /** Collage (84:91): `x` from the area's left edge; `z` is the stacking order. */
  desktop: PhotoPlacement & { z: number };
  /** Column (334:1201): `x` from the column's center, so it holds below 390. */
  mobile: PhotoPlacement;
};

/** Songs in overlay-me. Title and artist live in messages (`Overlay.me.sections.music.items.*`). */
export type SongId = 'wickedGame' | 'raindance' | 'trance';

/** A song on the shelf: its cover and its track on Spotify (no `?si=` tracking parameter). */
export type ShelfSong = ShelfItem<SongId> & {
  spotifyUrl: `https://open.spotify.com/track/${string}`;
};

/** Books in overlay-me. Title and author live in messages (`Overlay.me.sections.books.items.*`). */
export type BookId = 'goodNightMrHolmes' | 'likeSwitch' | 'designOfEverydayThings';

/** One item on a shelf (Fav songs, Books): its id and cover art. */
export type ShelfItem<Id extends string> = {
  id: Id;
  cover: ImageAsset;
};

/** A book on the shelf: its cover and the color of its back cover. */
export type ShelfBook = ShelfItem<BookId> & {
  /** Back cover, seen as the book's thickness. The cover's dominant color unless set by hand. */
  backColor: `#${string}`;
};

/** Films in overlay-me. Titles live in messages (`Overlay.me.sections.films.items.*`). */
export type FilmId = 'focus' | 'nowYouSeeMe' | 'theGentlemen';

/** A film on the shelf: its poster (`cover`) and release year, shown as its byline. */
export type ShelfFilm = ShelfItem<FilmId> & {
  year: number;
};

/** Case study copy (`WorkCases.*` in messages). */
type WorkCopy = (typeof messages)['WorkCases'];

/** A message key under `WorkCases`, such as `ces.overview.label`. */
export type WorkCopyKey = MessageKeys<WorkCopy, NestedKeyOf<WorkCopy>>;

/** A message group under `WorkCases` that holds `Field` (`ces.overview` holds `label`). */
export type WorkCopyGroup<Field extends string> = WorkCopyKey extends infer Key
  ? Key extends `${infer Group}.${Field}`
    ? Group
    : never
  : never;

/**
 * A text block of a case study: label and lead on the left, then either one
 * body (`<group>.body`) or titled topics, each with its own body. In a body,
 * a line break starts a new paragraph and an empty line adds a gap.
 */
export type WorkStoryBlock =
  | { kind: 'story'; copy: WorkCopyGroup<'label'> & WorkCopyGroup<'lead'> & WorkCopyGroup<'body'> }
  | {
      kind: 'topics';
      copy: WorkCopyGroup<'label'> & WorkCopyGroup<'lead'>;
      topics: readonly (WorkCopyGroup<'title'> & WorkCopyGroup<'body'>)[];
    };

/** A captioned photo of a case study. Alt text and caption live in `<copy>.alt` and `<copy>.caption`. */
export type WorkPhotoBlock = {
  kind: 'photo';
  copy: WorkCopyGroup<'alt'> & WorkCopyGroup<'caption'>;
  image: ImageAsset;
};

export type WorkBlock = WorkStoryBlock | WorkPhotoBlock;

/** Facts in the case header. Labels live in `Overlay.work.facts.*`; the year comes from the work. */
export type WorkFact =
  { id: 'year' } | { id: 'role' | 'productType' | 'projectType' | 'team'; value: WorkCopyKey };

/** A case study section after About: its nav label and blocks. */
export type WorkCaseSection = {
  /** Anchor part, unique within the case (`overlay-work-ces-scope`). */
  id: string;
  nav: WorkCopyKey;
  blocks: readonly WorkBlock[];
};

/**
 * One work overlay as data. Every case renders through the same components:
 * About (header, cover, optional private note, its blocks), then `sections`.
 */
export type WorkCase = {
  description: WorkCopyKey;
  /** 100 × 100 tile next to the title. Decorative: the title follows. */
  icon: ImageAsset;
  /** The cover under the header: a still or a looping video, with an optional caption below. */
  cover: { media: ImageAsset | VideoAsset; alt: WorkCopyKey; caption?: WorkCopyKey };
  facts: readonly WorkFact[];
  /** Live site, linked from the header. CES has none (D4). */
  liveSite?: ProjectSiteId;
  /** Shows the "Private project overview" card, which leads to the About blocks. */
  privateNote?: boolean;
  about: readonly WorkBlock[];
  sections: readonly WorkCaseSection[];
};

/** Which overlay is open: `?overlay=me` or `?work=<url slug>`. */
export type OverlayRoute = { kind: 'me' } | { kind: 'work'; slug: WorkSlug };

/**
 * One overlay as data (D5). Every overlay renders through the same component
 * tree; only these fields differ.
 */
export type OverlayContent =
  | {
      kind: 'me';
      /** Page section the overlay belongs to: first breadcrumb, active mobile menu item. */
      parentSection: SectionId;
      sections: readonly MeOverlaySectionId[];
      /** Section the overlay glides to right after opening. */
      initialSection?: MeOverlaySectionId;
    }
  | {
      kind: 'work';
      parentSection: SectionId;
    };
