'use client';

import { useRatingsMap, useSetRating } from '@/hooks/RatingsProvider';

export const RATINGS = {
  '1': 'Never',
  '2': 'Rarely',
  '3': 'Sometimes',
  '4': 'Always',
};

export type RatingKey = keyof typeof RATINGS;

export default function useRatingParam(
  attributeParam: string,
): [RatingKey | null, (value: string) => void, typeof RATINGS] {
  const ratingsMap = useRatingsMap();
  const setRating = useSetRating();

  const ratingValue = ratingsMap[attributeParam];
  const rating = ratingValue > 0 ? (String(ratingValue) as RatingKey) : null;

  return [
    rating,
    (value: string) => setRating(attributeParam, Number(value)),
    RATINGS,
  ];
}
