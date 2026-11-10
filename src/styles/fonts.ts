import { Cormorant_Garamond, Figtree } from 'next/font/google';

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

/**
 * The lettering of the Ollivanders street (WandScene), as on the wand shop
 * site. Not preloaded: the files download only when the scene renders.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
  variable: '--font-cormorant',
});
