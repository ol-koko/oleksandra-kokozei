'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Section } from '@/components/design-system/Section/Section';
import { TokenSample, TokenTable } from '@/components/design-system/TokenTable/TokenTable';
import { colorPalettes, type ColorPaletteId } from '@/content/designSystem';
import type { ColorRow } from '@/features/design-system/designSystemData';
import {
  chipFrame,
  placeIndicator,
  prefersReducedMotion,
  slideTiming,
} from '@/features/navigation/pillSlide';
import styles from './ColorsSection.module.css';

type ColorsSectionProps = {
  palettes: Record<ColorPaletteId, ColorRow[]>;
};

/**
 * Colors (Figma 761:830): one palette at a time, picked with the pills above
 * the table. The active pill slides to the chosen one like the language
 * switcher's (same indicator, duration and easing); with reduced motion it
 * switches at once. Every swatch is drawn with its token (`var(--gray-0)`); the name,
 * the semantic tokens that use it and its literal value are text.
 */
export function ColorsSection({ palettes }: ColorsSectionProps) {
  /** The pill that shows as current: it changes when the slide ends. */
  const [active, setActive] = useState<ColorPaletteId>(colorPalettes[0]);
  /** The palette in the table: it changes as the slide starts. */
  const [shown, setShown] = useState<ColorPaletteId>(colorPalettes[0]);
  /** The pill the indicator is sliding to; null while at rest. */
  const [target, setTarget] = useState<ColorPaletteId | null>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<Partial<Record<ColorPaletteId, HTMLButtonElement | null>>>({});
  const baseId = useId();

  function select(id: ColorPaletteId) {
    if (target || id === shown) return;
    setShown(id);
    const chip = tabRefs.current[id];
    const from = tabRefs.current[active];
    const indicator = indicatorRef.current;
    if (!chip || !from || !indicator || prefersReducedMotion()) {
      setActive(id);
      return;
    }

    placeIndicator(indicator, chip);
    setTarget(id);
    const settle = () => {
      setActive(id);
      setTarget(null);
    };
    const { duration, easing } = slideTiming(indicator);
    try {
      indicator
        .animate([chipFrame(from), chipFrame(chip)], { duration, easing })
        .finished.then(settle, settle);
    } catch {
      settle();
    }
  }

  function onKeyDown(event: KeyboardEvent, index: number) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = colorPalettes[(index + step + colorPalettes.length) % colorPalettes.length];
    if (!next) return;
    select(next);
    tabRefs.current[next]?.focus();
  }

  const tabs = (
    <div
      role="tablist"
      aria-label="Color palettes"
      className={`lang-switch ${styles.pills}`}
      data-sliding={target ? '' : undefined}
    >
      <span ref={indicatorRef} className="lang-switch__indicator" aria-hidden="true" />
      {colorPalettes.map((id, index) => (
        <button
          key={id}
          ref={(node) => {
            tabRefs.current[id] = node;
          }}
          type="button"
          role="tab"
          id={`${baseId}-${id}-tab`}
          aria-selected={id === shown}
          aria-current={id === active ? 'true' : undefined}
          aria-controls={`${baseId}-panel`}
          tabIndex={id === shown ? 0 : -1}
          data-target={id === target ? '' : undefined}
          className={`lang-pill ${styles.pill} text-body-m`}
          onClick={() => select(id)}
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
        aria-labelledby={`${baseId}-${shown}-tab`}
        tabIndex={0}
        className={styles.panel}
      >
        <TokenTable
          label={`${shown} colors`}
          rows={palettes[shown].map((row) => ({
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
