import { colorPalettes, type ColorPaletteId } from '@/content/designSystem';
import {
  assertKnownTokens,
  blurNotes,
  borderWidthNotes,
  durationNotes,
  hiddenTokens,
  iconSizeNotes,
  radiusNotes,
  shadowNotes,
  spacingNotes,
  typographyNotes,
} from '@/content/designSystemNotes';
import { formatColor, formatDuration } from './formatToken';
import { loadTokenSheet, type TokenSheet } from './tokenSheet';

/** One token in a table: its name (no `--`), what it is for and its literal value. */
export type TokenRow = {
  token: string;
  note: string;
  value: string;
};

export type ColorRow = TokenRow & {
  /** Semantic tokens that point at this color, without the `color-` prefix. */
  usedBy: string[];
};

export type TypeRow = {
  name: string;
  note: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
};

export type DesignSystemData = {
  palettes: Record<ColorPaletteId, ColorRow[]>;
  typography: {
    family: string;
    weightCount: number;
    styles: TypeRow[];
  };
  spacing: TokenRow[];
  radius: TokenRow[];
  borderWidth: TokenRow[];
  shadows: TokenRow[];
  blur: TokenRow[];
  iconSizes: TokenRow[];
  durations: TokenRow[];
  /** Blur tokens the Figma page has no specimen for (`blur-header`), so nothing is silently missing. */
  otherBlur: TokenRow[];
};

const isColorValue = (value: string) => value.startsWith('#') || value.startsWith('rgb');

function rows(
  sheet: TokenSheet,
  names: string[],
  notes: Record<string, string>,
  format: (value: string) => string = (value) => value,
): TokenRow[] {
  return names
    .filter((name) => !hiddenTokens.includes(name))
    .map((token) => ({ token, note: notes[token] ?? '', value: format(sheet.resolve(token)) }));
}

/** Tokens of a group that no specimen shows. */
function rest(sheet: TokenSheet, prefix: string, shown: string[], skip: string[] = []) {
  return rows(
    sheet,
    sheet.names(prefix).filter((name) => !shown.includes(name) && !skip.includes(name)),
    {},
  );
}

function palette(sheet: TokenSheet, id: ColorPaletteId): ColorRow[] {
  return sheet.names(`${id}-`).map((token) => ({
    token,
    note: '',
    value: formatColor(sheet.resolve(token)),
    usedBy: sheet
      .aliasesOf(token)
      .filter((alias) => alias.startsWith('color-'))
      .map((alias) => alias.slice('color-'.length)),
  }));
}

function toTypeFamily(fontFamily: string) {
  return fontFamily.split(',')[0]?.replace(/["']/g, '').trim() ?? '';
}

/** Everything the page shows about the tokens, read from design-tokens.css at build time. */
export async function loadDesignSystemData(): Promise<DesignSystemData> {
  const sheet = await loadTokenSheet();

  assertKnownTokens(spacingNotes, sheet.has, 'spacing');
  assertKnownTokens(radiusNotes, sheet.has, 'radius');
  assertKnownTokens(borderWidthNotes, sheet.has, 'border width');
  assertKnownTokens(shadowNotes, sheet.has, 'shadow');
  assertKnownTokens(blurNotes, sheet.has, 'blur');
  assertKnownTokens(iconSizeNotes, sheet.has, 'size');
  assertKnownTokens(durationNotes, sheet.has, 'duration');
  assertKnownTokens(
    typographyNotes,
    (name) => sheet.typeStyles.some((style) => style.name === name),
    'typography',
  );

  const spacing = rows(sheet, sheet.names('spacing-'), spacingNotes);
  const radius = rows(sheet, sheet.names('border-radius-'), radiusNotes);
  const borderWidth = rows(
    sheet,
    sheet.names('border-').filter((name) => !name.startsWith('border-radius-')),
    borderWidthNotes,
  );
  const shadows = rows(sheet, sheet.names('shadow-'), shadowNotes);
  const blur = rows(sheet, Object.keys(blurNotes), blurNotes);
  const iconSizes = rows(sheet, Object.keys(iconSizeNotes), iconSizeNotes);
  const durations = rows(sheet, sheet.names('duration-'), durationNotes, formatDuration);

  const palettes = Object.fromEntries(
    colorPalettes.map((id) => [id, palette(sheet, id)]),
  ) as DesignSystemData['palettes'];

  for (const rowsOfPalette of Object.values(palettes)) {
    for (const row of rowsOfPalette) {
      if (!isColorValue(row.value.split(' · ')[0] ?? '')) {
        throw new Error(`design system: --${row.token} does not resolve to a color`);
      }
    }
  }

  const weights = new Set(sheet.typeStyles.map((style) => style.fontWeight));

  return {
    palettes,
    typography: {
      family: toTypeFamily(sheet.resolve('font-family-figtree')),
      weightCount: weights.size,
      styles: sheet.typeStyles.map((style) => ({
        name: style.name,
        note: typographyNotes[style.name] ?? style.description,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
      })),
    },
    spacing,
    radius,
    borderWidth,
    shadows,
    blur,
    iconSizes,
    durations,
    otherBlur: rest(sheet, 'blur-', Object.keys(blurNotes)),
  };
}
