import { useTranslations } from 'next-intl';
import type { ComponentType, SVGProps } from 'react';
import { BehanceIcon } from '@/components/icons/BehanceIcon';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { LinkedInBoxIcon } from '@/components/icons/LinkedInBoxIcon';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
import { socialLinks } from '@/content/links';
import type { SocialLinkId } from '@/content/types';
import styles from './SocialLinks.module.css';

type Variant = 'inline' | 'tile';

/** Figma uses the boxed LinkedIn glyph in the footer and the plain one on tiles. */
const icons: Record<Variant, Record<SocialLinkId, ComponentType<SVGProps<SVGSVGElement>>>> = {
  inline: { linkedin: LinkedInBoxIcon, behance: BehanceIcon, github: GitHubIcon },
  tile: { linkedin: LinkedInIcon, behance: BehanceIcon, github: GitHubIcon },
};

type SocialLinksProps = {
  label: string;
  /** Which profiles to show, in display order. */
  order: readonly SocialLinkId[];
  /** `inline`: bare 24 px icons (footer). `tile`: 64 px tiles (Experience). */
  variant?: Variant;
  className?: string;
};

/** Icon-only links to social profiles. Opens in a new tab. */
export function SocialLinks({ label, order, variant = 'inline', className }: SocialLinksProps) {
  const t = useTranslations('Links');

  return (
    <nav aria-label={label} className={className}>
      <ul className={`${styles.list} ${styles[variant]}`}>
        {order.map((id) => {
          const link = socialLinks.find((item) => item.id === id);
          if (!link) return null;
          const Icon = icons[variant][id];

          return (
            <li key={id}>
              <a className={styles.link} href={link.href} target="_blank" rel="noopener noreferrer">
                <Icon />
                <span className="visually-hidden">
                  {t(`social.${id}`)} {t('opensInNewTab')}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
