const ALPHA_COLOR = /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\s*\)$/;

const hex = (channel: number) => channel.toString(16).padStart(2, '0').toUpperCase();

/**
 * A color token's literal as 6-digit hex, like Figma shows it: `#FFFFFF`. A
 * color with alpha shows its color only (white-80 is `#FFFFFF`): the opacity is
 * in the token's name, and the swatch is drawn with the real transparency.
 */
export function formatColor(value: string): string {
  const alpha = value.match(ALPHA_COLOR);
  if (alpha) {
    const [, red, green, blue] = alpha;
    return `#${[red, green, blue].map((channel) => hex(Number(channel))).join('')}`;
  }
  return value.startsWith('#') ? value.toUpperCase() : value;
}

/** `200ms` stays as it is; seconds become milliseconds. */
export function formatDuration(value: string): string {
  const amount = parseFloat(value);
  if (!Number.isFinite(amount)) return value;
  return value.endsWith('ms') ? value : `${amount * 1000}ms`;
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

/** `8` -> `eight`, for the sentences that count tokens ("eight text styles"). */
export function numberWord(count: number): string {
  return NUMBER_WORDS[count] ?? String(count);
}
