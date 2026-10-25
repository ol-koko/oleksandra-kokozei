import { readFile } from 'node:fs/promises';
import path from 'node:path';

const TOKENS_CSS = path.join(process.cwd(), 'design-system', 'design-tokens.css');

/** A typography class (`.text-body-m`) as declared in design-tokens.css. */
export type TypeStyle = {
  /** `body-m`, without the `.text-` prefix. */
  name: string;
  /** The comment above the class ("Use for ..."). */
  description: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
};

/** Every custom property in the `:root` block of design-tokens.css, in file order. */
export type TokenSheet = {
  /** Names (without `--`) that start with `prefix`. */
  names: (prefix: string) => string[];
  has: (name: string) => boolean;
  /** The declared value (`var(--dimension-2)`), as written. */
  declared: (name: string) => string;
  /** The value with every `var()` followed down to its literal (`8px`). */
  resolve: (name: string) => string;
  /** Tokens declared as a plain alias of `name` (`--color-text-primary: var(--gray-800)`). */
  aliasesOf: (name: string) => string[];
  typeStyles: TypeStyle[];
};

const DECLARATION = /--([\w-]+)\s*:\s*([^;]+);/g;
const TYPE_CLASS = /\/\*\s*([^*]+?)\s*\*\/\s*\.text-([\w-]+)\s*\{([^}]*)\}/g;
const VAR = /var\(--([\w-]+)\)/g;

function parseSheet(css: string): TokenSheet {
  const root = css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  const declarations = new Map<string, string>();
  for (const [, name, value] of root.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(DECLARATION)) {
    if (name && value) declarations.set(name, value.replace(/\s+/g, ' ').trim());
  }

  const resolve = (name: string, depth = 0): string => {
    const value = declarations.get(name);
    if (value === undefined || depth > 10) return '';
    return value.replace(VAR, (_, inner: string) => resolve(inner, depth + 1) || `var(--${inner})`);
  };

  const typeStyles = [...css.matchAll(TYPE_CLASS)].map(([, description, name, body]) => {
    const property = (key: string) => {
      const reference = body?.match(new RegExp(`${key}:\\s*var\\(--([\\w-]+)\\)`))?.[1];
      return reference ? resolve(reference) : '';
    };
    return {
      name: name ?? '',
      description: description ?? '',
      fontSize: property('font-size'),
      fontWeight: property('font-weight'),
      lineHeight: property('line-height'),
    };
  });

  return {
    names: (prefix) => [...declarations.keys()].filter((name) => name.startsWith(prefix)),
    has: (name) => declarations.has(name),
    declared: (name) => declarations.get(name) ?? '',
    resolve: (name) => resolve(name),
    aliasesOf: (name) =>
      [...declarations].filter(([, value]) => value === `var(--${name})`).map(([key]) => key),
    typeStyles,
  };
}

let sheet: Promise<TokenSheet> | undefined;

/**
 * The design tokens the site really uses, read from design-system/design-tokens.css
 * at build time. The page never keeps its own copy of a value.
 */
export function loadTokenSheet(): Promise<TokenSheet> {
  sheet ??= readFile(TOKENS_CSS, 'utf8').then(parseSheet);
  return sheet;
}
