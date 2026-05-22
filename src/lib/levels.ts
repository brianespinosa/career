import EM from '@/data/em.json';
import EMML from '@/data/em-ml.json';
import IC from '@/data/ic.json';
import ICMML from '@/data/ic-ml.json';

export const LEVELS = { ...IC, ...EM, ...EMML, ...ICMML } as const;
