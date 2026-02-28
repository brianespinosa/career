import ATTRIBUTES from '@/data/attributes.json';
import { LEVELS } from '@/lib/levels';

/**
 * Returns ordered attribute params for a level (e.g. ['acc','ctd','com',...]).
 * Order matches Object.values(ATTRIBUTES) filtered to only attributes defined for the level.
 */
export function getAttributeParamsForLevel(level: string): string[] {
  const levelData = LEVELS[level as keyof typeof LEVELS];
  if (!levelData) return [];

  return Object.values(ATTRIBUTES)
    .filter(
      ({ key }) =>
        levelData.attributes[key as keyof typeof levelData.attributes] !==
        undefined,
    )
    .map(({ param }) => param);
}

/**
 * Builds a path string from level + ratings record.
 * Trailing zero segments are omitted for shorter URLs.
 * e.g. { acc: 3, ctd: 4, com: 0 } → '/P3/3/4'
 */
export function buildRatingPath(
  level: string,
  ratings: Record<string, number>,
): string {
  const params = getAttributeParamsForLevel(level);
  const segments = params.map((param) => String(ratings[param] ?? 0));

  // Trim trailing zeros
  while (segments.length > 0 && segments[segments.length - 1] === '0') {
    segments.pop();
  }

  return ['', level, ...segments].join('/');
}

/**
 * Parses path segments into a ratings record, defaulting missing values to 0.
 * e.g. ['3', '4'] → { acc: 3, ctd: 4, com: 0, ... }
 */
export function parseRatings(
  level: string,
  segments: string[],
): Record<string, number> {
  const params = getAttributeParamsForLevel(level);
  const ratings: Record<string, number> = {};

  for (let i = 0; i < params.length; i++) {
    ratings[params[i]] = Number(segments[i]) || 0;
  }

  return ratings;
}
