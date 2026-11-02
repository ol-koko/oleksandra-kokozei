import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { TokenSheet } from './tokenSheet';

const DESIGN_SYSTEM_DIR = path.join(process.cwd(), 'design-system');

type Rule = { selector: string; declarations: string[] };

const RULE = /([^{}]+)\{([^{}]*)\}/g;
const VAR = /var\(--([\w-]+)\)/g;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseRules(css: string): Rule[] {
  return [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(RULE)].map(([, selector, body]) => ({
    selector: (selector ?? '').trim(),
    declarations: (body ?? '')
      .split(';')
      .map((declaration) => declaration.replace(/\s+/g, ' ').trim())
      .filter(Boolean),
  }));
}

/** The declaration with each `var(--token)` followed by its literal in a trailing comment. */
function withResolvedTokens(declaration: string, sheet: TokenSheet) {
  const resolved = declaration.replace(VAR, (match, name: string) => sheet.resolve(name) || match);
  return resolved === declaration ? `${declaration};` : `${declaration}; /* ${resolved} */`;
}

/**
 * The CSS a specimen is made of: every rule in `file` whose selectors all name
 * `className` (the class, its hover, focus and child rules), as written, with
 * the literal value of each token in a comment. This is what the specimen's
 * code button copies.
 */
export async function cssForClass(
  file: 'animations.css' | 'hover.css',
  className: string,
  sheet: TokenSheet,
): Promise<string> {
  const css = await readFile(path.join(DESIGN_SYSTEM_DIR, file), 'utf8');
  const named = new RegExp(`\\.${escapeRegExp(className)}(?![A-Za-z0-9-])`);

  return parseRules(css)
    .filter(({ selector }) => selector.split(',').every((part) => named.test(part)))
    .map(
      ({ selector, declarations }) =>
        `${selector.split(',').map((part) => part.trim()).join(',\n')} {\n${declarations
          .map((declaration) => `  ${withResolvedTokens(declaration, sheet)}`)
          .join('\n')}\n}`,
    )
    .join('\n\n');
}
