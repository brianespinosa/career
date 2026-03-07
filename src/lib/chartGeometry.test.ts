import { describe, expect, it } from 'vitest';
import {
  CHART_SIZE,
  computeChartGeometry,
  INNER_RADIUS,
  RADIUS_MAX,
  THEME_HEX_COLORS,
} from './chartGeometry';

const makeAttr = (key: string, value = 1, colorName = 'red') => ({
  key,
  name: key,
  colorName,
  value,
});

describe('constants', () => {
  it('RADIUS_MAX is half of CHART_SIZE', () => {
    expect(RADIUS_MAX).toBe(CHART_SIZE / 2);
  });

  it('INNER_RADIUS is 20% of RADIUS_MAX', () => {
    expect(INNER_RADIUS).toBeCloseTo(RADIUS_MAX / 5);
  });

  it('THEME_HEX_COLORS has entries for red, blue, green, yellow', () => {
    expect(Object.keys(THEME_HEX_COLORS)).toEqual(
      expect.arrayContaining(['red', 'blue', 'green', 'yellow']),
    );
  });
});

describe('computeChartGeometry', () => {
  it('returns one ArcGeometry per attribute', () => {
    const attrs = [makeAttr('a'), makeAttr('b'), makeAttr('c')];
    const result = computeChartGeometry({ attributes: attrs });
    expect(result).toHaveLength(3);
  });

  it('preserves key and name from input', () => {
    const [result] = computeChartGeometry({ attributes: [makeAttr('foo')] });
    expect(result.key).toBe('foo');
    expect(result.name).toBe('foo');
  });

  it('sets rating from input value', () => {
    const [result] = computeChartGeometry({ attributes: [makeAttr('a', 3)] });
    expect(result.rating).toBe(3);
  });

  it('produces an empty pathD for zero-value attributes', () => {
    const [result] = computeChartGeometry({ attributes: [makeAttr('a', 0)] });
    expect(result.pathD).toBe('');
  });

  it('produces a non-empty pathD for positive-value attributes', () => {
    const [result] = computeChartGeometry({ attributes: [makeAttr('a', 2)] });
    expect(result.pathD.length).toBeGreaterThan(0);
  });

  it('outerRadius is within [INNER_RADIUS, RADIUS_MAX]', () => {
    const attrs = [makeAttr('a', 1), makeAttr('b', 4)];
    computeChartGeometry({ attributes: attrs }).forEach(({ outerRadius }) => {
      expect(outerRadius).toBeGreaterThanOrEqual(INNER_RADIUS);
      expect(outerRadius).toBeLessThanOrEqual(RADIUS_MAX);
    });
  });

  it('returns the fallback hex for an unknown colorName', () => {
    const [result] = computeChartGeometry({
      attributes: [makeAttr('a', 1, 'purple')],
    });
    expect(result.hexColor).toBe('#888888');
  });

  it('endAngle is greater than startAngle for each arc', () => {
    const attrs = [makeAttr('a'), makeAttr('b'), makeAttr('c')];
    computeChartGeometry({ attributes: attrs }).forEach(
      ({ startAngle, endAngle }) => {
        expect(endAngle).toBeGreaterThan(startAngle);
      },
    );
  });

  it('returns an empty array for empty input', () => {
    expect(computeChartGeometry({ attributes: [] })).toEqual([]);
  });
});
