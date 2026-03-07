import { describe, expect, it } from 'vitest';
import { formatRatingDate, SITE_DESCRIPTION, SITE_TITLE } from './siteConfig';

describe('SITE_TITLE', () => {
  it('is a non-empty string', () => {
    expect(typeof SITE_TITLE).toBe('string');
    expect(SITE_TITLE.length).toBeGreaterThan(0);
  });
});

describe('SITE_DESCRIPTION', () => {
  it('is a non-empty string', () => {
    expect(typeof SITE_DESCRIPTION).toBe('string');
    expect(SITE_DESCRIPTION.length).toBeGreaterThan(0);
  });
});

describe('formatRatingDate', () => {
  it('formats a known date correctly', () => {
    const date = new Date(2025, 0, 15); // January 15, 2025
    // Match loosely to avoid locale/ICU build differences across environments
    expect(formatRatingDate(date)).toMatch(/January.+15.+2025/);
  });

  it('uses the current date when no argument is given', () => {
    const result = formatRatingDate();
    expect(result).toMatch(/\w+ \d+, \d{4}/);
  });
});
