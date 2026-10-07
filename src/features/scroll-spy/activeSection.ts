/** Activation line: a third of the way down the scroll viewport. */
export const ACTIVATION_RATIO = 1 / 3;
/** Within this many px of the scroll end, the last section is active. */
export const BOTTOM_THRESHOLD = 24;
/** Keys that scroll; any of them ends a click lock. */
export const SCROLL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
]);

type PickOptions = {
  /** Y of the activation line, in the same coordinates as `topOf`. */
  line: number;
  /** The scroll position is at the end, where a short last section may never reach the line. */
  nearBottom: boolean;
  /** Top edge of a section, or undefined when it is not in the document. */
  topOf: (id: string) => number | undefined;
};

/**
 * Shared scroll-spy rule for the page and the overlays: the active section is
 * the last one, in document order, whose top edge has passed the activation
 * line; at the scroll end it is the last section.
 */
export function pickActiveSection<Id extends string>(
  ids: readonly Id[],
  { line, nearBottom, topOf }: PickOptions,
): Id | undefined {
  if (nearBottom) return ids.at(-1);

  let current = ids[0];
  for (const id of ids) {
    const top = topOf(id);
    if (top !== undefined && top <= line) current = id;
  }
  return current;
}
