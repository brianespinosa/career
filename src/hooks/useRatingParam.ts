'use client';

import { useContext } from 'react';

import { RatingsContext } from '@/hooks/RatingsProvider';

export const RATINGS = {
  '1': 'Never',
  '2': 'Rarely',
  '3': 'Sometimes',
  '4': 'Always',
};

export type RatingKey = keyof typeof RATINGS;

export default function useRatingParam(
  attributeParam: string,
): [RatingKey | null, (value: RatingKey) => void, typeof RATINGS] {
  const { ratings, setRating } = useContext(RatingsContext);
  const value = ratings[attributeParam];
  const ratingKey = value ? (value.toString() as RatingKey) : null;

  return [
    ratingKey,
    (v: RatingKey) => setRating(attributeParam, Number(v)),
    RATINGS,
  ];
}
