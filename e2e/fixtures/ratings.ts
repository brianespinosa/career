// Known stable encoded URL used in Lighthouse CI and Playwright e2e tests.
// Decoded via: parseInt('3ckmgrhn', 36).toString(5).slice(1) = '3300010000000030'
// P1 attribute params in order: acc, ctd, ddp, ds, dm, dir, rslt, imp, comp, pi, pa, pln, req, rsk, inf, tbld
export const P1_ENCODED = '3ckmgrhn';

// Attributes with rating > 0 in the encoded URL above.
export const P1_ENCODED_RATINGS = {
  acc: { name: 'Accountability', label: 'Sometimes' },
  ctd: { name: 'Coding, Testing, & Debugging', label: 'Sometimes' },
  dir: { name: 'Direction', label: 'Never' },
  inf: { name: 'Sphere of Influence', label: 'Sometimes' },
} as const;

// Attributes visible in OpportunitiesCard for the encoded URL above.
// hasMultipleLevels = true (lowest rating = 1, highest = 3), so only
// attributes with a rating below the highest are shown.
export const P1_OPPORTUNITIES = [
  { name: 'Direction', ratingLabel: 'Never' },
] as const;
