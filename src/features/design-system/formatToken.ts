const ALPHA_COLOR = /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\s*\)$/;

/**
 * A color token's literal as text: `#FFFFFF`, or for a color with alpha
 * `rgba(0, 0, 0, 0.1) · 10%`. The page shows what the token really is, as text
 * and not only as a swatch.
 */
export function formatColor(value: string): string {
  const alpha = value.match(ALPHA_COLOR);
  if (alpha) {
    const [, red, green, blue, opacity] = alpha;
    const percent = Math.round(Number(opacity) * 100);
    return `rgba(${red}, ${green}, ${blue}, ${opacity}) · ${percent}%`;
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
