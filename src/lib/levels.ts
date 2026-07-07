import CSEM from '@/data/cs-em.json';
import CSPS from '@/data/cs-ps.json';
import CSTSE from '@/data/cs-tse.json';
import EM from '@/data/em.json';
import EMML from '@/data/em-ml.json';
import IC from '@/data/ic.json';
import ICMML from '@/data/ic-ml.json';

export const LEVELS = {
  ...IC,
  ...EM,
  ...EMML,
  ...ICMML,
  ...CSPS,
  ...CSTSE,
  ...CSEM,
} as const;

export interface TrackContext {
  /** Human-readable track label, e.g. "Software Engineer (IC)". */
  trackLabel: string;
  /** Noun used for the person on this track, e.g. "engineer". */
  roleNoun: string;
}

/**
 * Resolves the display track and role noun for a level key. Customer Support
 * tracks are matched by membership; the SWE IC/EM tracks fall back to the
 * `P…`/`M…` key-prefix convention.
 */
export function getTrackContext(levelKey: string): TrackContext {
  if (levelKey in CSPS)
    return {
      trackLabel: 'Product Support Specialist (IC)',
      roleNoun: 'support specialist',
    };
  if (levelKey in CSTSE)
    return {
      trackLabel: 'Technical Support Engineer (IC)',
      roleNoun: 'support engineer',
    };
  if (levelKey in CSEM)
    return { trackLabel: 'Customer Support Manager (EM)', roleNoun: 'manager' };
  if (levelKey.startsWith('P'))
    return { trackLabel: 'Software Engineer (IC)', roleNoun: 'engineer' };
  return {
    trackLabel: 'Engineering Manager (EM)',
    roleNoun: 'engineering manager',
  };
}
