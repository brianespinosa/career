import EM from '@/data/em.json';
import IC from '@/data/ic.json';

export const LEVELS = { ...IC, ...EM } as const;
