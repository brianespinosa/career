export const SITE_TITLE = 'Career Ladder Self Assessment';
export const SITE_DESCRIPTION =
  'An interactive self-assessment tool for engineering career ladder levels.';

export function formatRatingDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
