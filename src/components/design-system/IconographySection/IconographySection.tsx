import type { ComponentType, SVGProps } from 'react';
import { Section, Subsection } from '@/components/design-system/Section/Section';
import { TokenTable } from '@/components/design-system/TokenTable/TokenTable';
import { ArrowDownIcon } from '@/components/icons/ArrowDownIcon';
import { ArrowUpRightIcon } from '@/components/icons/ArrowUpRightIcon';
import { BehanceIcon } from '@/components/icons/BehanceIcon';
import { CaretRightIcon } from '@/components/icons/CaretRightIcon';
import { CaretRightSmallIcon } from '@/components/icons/CaretRightSmallIcon';
import { ExpandIcon } from '@/components/icons/ExpandIcon';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { LinkIcon } from '@/components/icons/LinkIcon';
import { LinkedInBoxIcon } from '@/components/icons/LinkedInBoxIcon';
import { LocationIcon } from '@/components/icons/LocationIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { MenuToggleIcon } from '@/components/icons/MenuToggleIcon';
import { iconGroups, type IconId } from '@/content/designSystem';
import type { DesignSystemData } from '@/features/design-system/designSystemData';
import styles from './IconographySection.module.css';

type IconographySectionProps = {
  sizes: DesignSystemData['iconSizes'];
  otherSizes: DesignSystemData['other']['size'];
};

const icons: Record<IconId, ComponentType<SVGProps<SVGSVGElement>>> = {
  lock: LockIcon,
  location: LocationIcon,
  'caret-right': CaretRightIcon,
  'caret-right-small': CaretRightSmallIcon,
  'arrow-down': ArrowDownIcon,
  'arrow-up-right': ArrowUpRightIcon,
  link: LinkIcon,
  expand: ExpandIcon,
  menu: (props) => <MenuToggleIcon open={false} {...props} />,
  close: (props) => <MenuToggleIcon open {...props} />,
  linkedin: LinkedInBoxIcon,
  behance: BehanceIcon,
  github: GitHubIcon,
};

/** Iconography (Figma 803:590): the icon sizes, then every icon component of the site. */
export function IconographySection({ sizes, otherSizes }: IconographySectionProps) {
  return (
    <Section id="iconography" title="Iconography">
      <Subsection id="iconography-size" title="Size">
        <ul className={styles.sizes}>
          {sizes.map((row) => (
            <li key={row.token} className={styles.size}>
              <span
                className={styles.sizeBox}
                style={{ inlineSize: `var(--${row.token})`, blockSize: `var(--${row.token})` }}
              />
              <span className={`${styles.sizeName} text-body-m`}>{row.note}</span>
              <span className={`${styles.sizeValue} text-body-xs`}>{row.value}</span>
              <span className="visually-hidden">{`--${row.token}`}</span>
            </li>
          ))}
        </ul>
        {otherSizes.length > 0 && <TokenTable label="Other size tokens" rows={otherSizes} />}
      </Subsection>

      {iconGroups.map((group) => (
        <Subsection key={group.id} id={group.id} title={group.title}>
          <ul className={styles.grid}>
            {group.icons.map((icon) => {
              const Icon = icons[icon.id];
              return (
                <li key={icon.id} className={styles.item}>
                  <span className={styles.tile}>
                    <Icon />
                  </span>
                  <span className={`${styles.label} text-body-s`}>{icon.label}</span>
                </li>
              );
            })}
          </ul>
        </Subsection>
      ))}
    </Section>
  );
}
