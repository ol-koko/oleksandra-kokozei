import { Figtree } from 'next/font/google';

/**
 * Figtree, self-hosted by next/font. Weights match the typography tokens
 * (--font-weight-light, --font-weight-regular). The generated family is exposed
 * as --font-figtree and mapped to the --font-family-figtree token in globals.css.
 */
export const figtree = Figtree({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400'],
  display: 'swap',
  variable: '--font-figtree',
});
