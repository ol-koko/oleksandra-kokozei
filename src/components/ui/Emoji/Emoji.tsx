type EmojiProps = {
  symbol: string;
  /** Names a meaningful emoji. Without one the emoji is decorative and hidden from assistive tech. */
  label?: string;
};

/**
 * A native emoji, drawn in each operating system's own style. Decorative by
 * default, so text next to it is not read twice.
 */
export function Emoji({ symbol, label }: EmojiProps) {
  return label ? (
    <span role="img" aria-label={label}>
      {symbol}
    </span>
  ) : (
    <span aria-hidden="true">{symbol}</span>
  );
}

/** One emoji at the start of a text (with its variation selector, modifiers and joins), then a space. */
const LEADING_EMOJI =
  /^(\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier}|‍\p{Extended_Pictographic})*)\s+/u;

/** Splits a leading emoji off a message such as "💼 Vacancies and applications". */
export function splitLeadingEmoji(text: string): { emoji?: string; text: string } {
  const match = LEADING_EMOJI.exec(text);
  return match ? { emoji: match[1], text: text.slice(match[0].length) } : { text };
}
