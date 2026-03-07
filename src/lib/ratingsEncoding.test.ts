import { describe, expect, it } from 'vitest';
import {
  decodeRatings,
  encodeRatings,
  getAttributeParamsForLevel,
} from './ratingsEncoding';

describe('getAttributeParamsForLevel', () => {
  it('returns an array of param strings for a valid level', () => {
    const params = getAttributeParamsForLevel('P1');
    expect(Array.isArray(params)).toBe(true);
    expect(params.length).toBeGreaterThan(0);
    for (const p of params) {
      expect(typeof p).toBe('string');
    }
  });
});

describe('encodeRatings / decodeRatings round-trip', () => {
  it('encodes and decodes all-zero ratings', () => {
    const params = getAttributeParamsForLevel('P1');
    const ratings = Object.fromEntries(params.map((p) => [p, 0]));
    const encoded = encodeRatings(ratings, 'P1');
    const decoded = decodeRatings(encoded, 'P1');
    expect(decoded).toEqual(ratings);
  });

  it('encodes and decodes mixed ratings', () => {
    const params = getAttributeParamsForLevel('P1');
    const ratings: Record<string, number> = {};
    params.forEach((p, i) => {
      ratings[p] = (i % 5) as 0 | 1 | 2 | 3 | 4;
    });
    const encoded = encodeRatings(ratings, 'P1');
    const decoded = decodeRatings(encoded, 'P1');
    expect(decoded).toEqual(ratings);
  });

  it('encodes and decodes all-max ratings', () => {
    const params = getAttributeParamsForLevel('P1');
    const ratings = Object.fromEntries(params.map((p) => [p, 4]));
    const encoded = encodeRatings(ratings, 'P1');
    const decoded = decodeRatings(encoded, 'P1');
    expect(decoded).toEqual(ratings);
  });

  it('clamps out-of-range values to [0, 4] on encode', () => {
    const params = getAttributeParamsForLevel('P1');

    const highRatings = Object.fromEntries(params.map((p) => [p, 10]));
    const highDecoded = decodeRatings(encodeRatings(highRatings, 'P1'), 'P1');
    for (const v of Object.values(highDecoded)) {
      expect(v).toBeLessThanOrEqual(4);
    }

    const lowRatings = Object.fromEntries(params.map((p) => [p, -5]));
    const lowDecoded = decodeRatings(encodeRatings(lowRatings, 'P1'), 'P1');
    for (const v of Object.values(lowDecoded)) {
      expect(v).toBeGreaterThanOrEqual(0);
    }
  });

  it('returns all-zero ratings for an invalid encoded string', () => {
    const params = getAttributeParamsForLevel('P1');
    const decoded = decodeRatings('!!!invalid!!!', 'P1');
    const expected = Object.fromEntries(params.map((p) => [p, 0]));
    expect(decoded).toEqual(expected);
  });

  it('works for an EM level', () => {
    const params = getAttributeParamsForLevel('M3');
    const ratings = Object.fromEntries(params.map((p) => [p, 2]));
    const encoded = encodeRatings(ratings, 'M3');
    const decoded = decodeRatings(encoded, 'M3');
    expect(decoded).toEqual(ratings);
  });

  it('pads or truncates when encoded segment length mismatches the level', () => {
    // Encode for P1, then decode as M3 — the levels have different attribute counts.
    // decodeRatings pads short digit strings with leading zeros and truncates long ones.
    const p1Params = getAttributeParamsForLevel('P1');
    const p1Ratings = Object.fromEntries(p1Params.map((p) => [p, 2]));
    const p1Encoded = encodeRatings(p1Ratings, 'P1');

    const m3Params = getAttributeParamsForLevel('M3');
    const decoded = decodeRatings(p1Encoded, 'M3');

    // All values must be in valid range regardless of length mismatch
    expect(Object.keys(decoded)).toEqual(m3Params);
    for (const v of Object.values(decoded)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(4);
    }
  });

  it('produces the known encoded value for the stable test URL', () => {
    // /P1/3ckmgrhn is used in e2e and Lighthouse CI as a stable known URL.
    // Decoding it should produce a valid ratings object with all values in [0,4].
    const decoded = decodeRatings('3ckmgrhn', 'P1');
    Object.values(decoded).forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(4);
    });
    // Re-encoding should reproduce the same string.
    expect(encodeRatings(decoded, 'P1')).toBe('3ckmgrhn');
  });
});
