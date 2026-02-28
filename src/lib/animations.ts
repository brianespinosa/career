// Shared animation configs for motion components

// Used by AltChart arc segments and OpportunitiesCard list items
export const ratingAppearAnimation = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
} as const;

// Card-level fade for OpportunitiesCard (and future cards)
export const cardFadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;
