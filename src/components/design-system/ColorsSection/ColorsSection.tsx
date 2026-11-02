'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Section } from '@/components/design-system/Section/Section';
import { TokenSample, TokenTable } from '@/components/design-system/TokenTable/TokenTable';
import { colorPalettes, type ColorPaletteId } from '@/content/designSystem';
import type { ColorRow } from '@/features/design-system/designSystemData';
import styles from './ColorsSection.module.css';

type ColorsSectionProps = {
  palettes: Record<ColorPaletteId, ColorRow[]>;
};

/**
 * Colors (Figma 761:830): one palette at a time, picked with the pills above
 * the table. Every swatch is drawn with its token (`var(--gray-0)`); the name,
 * the semantic tokens that use it and its literal value are text.
 */
export function ColorsSection({ palettes }: ColorsSectionProps) {
  const [active, setActive] = useState<ColorPaletteId>(colorPalettes[0]);
  const tabRefs = useRef<Partial<Record<ColorPaletteId, HTMLButtonElement | null>>>({});
  const baseId = useId();

  function onKeyDown(event: KeyboardEvent, index: number) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = colorPalettes[(index + step + colorPalettes.length) % colorPalettes.length];
    if (!next) return;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const tabs = (
    <div role="tablist" aria-label="Color palettes" className={styles.pills}>
      {colorPalettes.map((id, index) => (
        <button
          key={id}
          ref={(node) => {
            tabRefs.current[id] = node;
          }}
          type="button"
          role="tab"
          id={`${baseId}-${id}-tab`}
          aria-selected={id === active}
          aria-current={id === active ? 'true' : undefined}
          aria-controls={`${baseId}-panel`}
          tabIndex={id === active ? 0 : -1}
          className={`lang-pill ${styles.pill} text-body-m`}
          onClick={() => setActive(id)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          {id}
        </button>
      ))}
    </div>
  );

  return (
    <Section id="colors" title="Colors" compact headerContent={tabs}>
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-${active}-tab`}
        tabIndex={0}
        className={styles.panel}
      >
        <TokenTable
          label={`${active} colors`}
          rows={palettes[active].map((row) => ({
            id: row.token,
            name: row.token,
            note: row.usedBy.length > 0 ? row.usedBy.join(', ') : 'Not used by a semantic token',
            value: row.value,
            sample: <TokenSample kind="swatch" token={row.token} />,
          }))}
        />
      </div>
    </Section>
  );
}
