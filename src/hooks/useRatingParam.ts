'use client';

import { useQueryState } from 'nuqs';

const RATINGS = {
  '1': 'Never',
  '2': 'Rarely',
  '3': 'Sometimes',
  '4': 'Always',
};

export default function useRatingParam(attributeParam: string) {
  const [rating, setRating] = useQueryState(attributeParam, {
    // defaultValue: '',
    clearOnDefault: false,
  });

  const ratingOrUndefined = (rating as keyof typeof RATINGS) ?? undefined;

  return [ratingOrUndefined, setRating, RATINGS];
}
