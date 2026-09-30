import type { Role } from './types';

export const roles = [
  { id: 'independent', paragraphs: ['p1', 'p2', 'p3'] },
] as const satisfies readonly Role[];
