'use client';

import { useQueryState } from 'nuqs';

const RATINGS = {
  '1': 'Never',
  '2': 'Rarely',
  '3': 'Sometimes',
  '4': 'Always',
};

export type RatingKey = keyof typeof RATINGS;

export default function useRatingParam(
  attributeParam: string,
): [RatingKey | null, (value: string) => void, typeof RATINGS] {
  const [rating, setRating] = useQueryState(attributeParam, {
    // defaultValue: '',
    clearOnDefault: false,
  });

  return [
    rating as RatingKey | null,
    setRating as (value: string) => void,
    RATINGS,
  ];
}
