import ATTRIBUTES from '@/data/attributes.json';
import { LEVELS } from '@/lib/levels';
import type { LevelKeys } from '@/types/levels';

export function getAttributeParamsForLevel(level: LevelKeys): string[] {
  const levelAttributes = LEVELS[level].attributes;
  return Object.values(ATTRIBUTES)
    .filter((attr) => attr.key in levelAttributes)
    .map((attr) => attr.param);
}

export function encodeRatings(
  ratings: Record<string, number>,
  level: LevelKeys,
): string {
  const params = getAttributeParamsForLevel(level);
  const digits = params
    .map((p) => String(Math.max(0, Math.min(4, ratings[p] ?? 0))))
    .join('');
  const withSentinel = `1${digits}`;
  return parseInt(withSentinel, 5).toString(36);
}

export function decodeRatings(
  encoded: string,
  level: LevelKeys,
): Record<string, number> {
  const params = getAttributeParamsForLevel(level);
  const num = parseInt(encoded, 36);
  if (Number.isNaN(num)) return Object.fromEntries(params.map((p) => [p, 0]));
  const base5 = num.toString(5);
  // strip leading sentinel "1"
  const digits = base5.slice(1);
  // pad to expected length in case of leading zeros
  const padded = digits.padStart(params.length, '0').slice(0, params.length);
  return Object.fromEntries(
    params.map((param, i) => [
      param,
      Math.max(0, Math.min(4, Number(padded[i] ?? '0'))),
    ]),
  );
}
