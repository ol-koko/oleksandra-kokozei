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

/** Works on the main page. Title and description live in messages (`Works.items.*`). */
export type WorkSlug = 'ces' | 'juJutsu' | 'blowStressAway' | 'filmBudget';

export type WorkCover = {
  image: ImageAsset;
  /** `photo` fills the cover; `mockup` is a device frame centered at 90 % of the cover height. */
  fit: 'photo' | 'mockup';
  /** Surface behind the image: grey placeholder or the pink media gradient. */
  background?: 'placeholder' | 'gradient';
  /** Logo on top of the image, at its intrinsic size. */
  logo?: ImageAsset & { placement: 'center' | 'top-end' };
};

export type Work = {
  slug: WorkSlug;
  year: number;
  cover: WorkCover;
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
export type MeOverlaySectionId = 'about' | 'home' | 'music' | 'books';

/** Sections of every work overlay. Labels live in messages (`Overlay.work.sections.*`). */
export type WorkOverlaySectionId = 'about' | 'goal' | 'problem' | 'result';

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
    }
  | {
      kind: 'work';
      parentSection: SectionId;
      sections: readonly WorkOverlaySectionId[];
    };
