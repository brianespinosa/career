import { describe, expect, it } from 'vitest';
import { getTrackContext, LEVELS } from './levels';

describe('LEVELS', () => {
  it('includes all Customer Support tracks with globally unique keys', () => {
    for (const key of ['P1PS', 'P3PS', 'P1TSE', 'P3TSE', 'M2CS', 'M5CS']) {
      expect(key in LEVELS).toBe(true);
    }
    // Existing SWE levels remain present (no key collisions).
    expect('P1' in LEVELS).toBe(true);
    expect('M3' in LEVELS).toBe(true);
  });
});

describe('getTrackContext', () => {
  it('resolves Product Support IC levels', () => {
    expect(getTrackContext('P1PS')).toEqual({
      trackLabel: 'Product Support Specialist (IC)',
      roleNoun: 'support specialist',
    });
  });

  it('resolves Technical Support Engineering IC levels', () => {
    expect(getTrackContext('P2TSE')).toEqual({
      trackLabel: 'Technical Support Engineer (IC)',
      roleNoun: 'support engineer',
    });
  });

  it('resolves Customer Support manager levels', () => {
    expect(getTrackContext('M4CS')).toEqual({
      trackLabel: 'Customer Support Manager (EM)',
      roleNoun: 'manager',
    });
  });

  it('falls back to Software Engineer (IC) for P-prefixed SWE levels', () => {
    expect(getTrackContext('P1')).toEqual({
      trackLabel: 'Software Engineer (IC)',
      roleNoun: 'engineer',
    });
  });

  it('falls back to Engineering Manager (EM) for other levels', () => {
    expect(getTrackContext('M3')).toEqual({
      trackLabel: 'Engineering Manager (EM)',
      roleNoun: 'engineering manager',
    });
  });
});
