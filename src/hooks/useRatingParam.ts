'use client';

import { useParams, useRouter } from 'next/navigation';

import { buildRatingPath, parseRatings } from '@/lib/ratingPath';

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
  const params = useParams();
  const router = useRouter();

  const level = params.level as string;
  const ratingsSegments = (params.ratings as string[]) ?? [];

  const ratingsMap = parseRatings(level, ratingsSegments);
  const ratingValue = ratingsMap[attributeParam];

  const rating = ratingValue > 0 ? (String(ratingValue) as RatingKey) : null;

  const setRating = (value: string) => {
    const newRatings = { ...ratingsMap, [attributeParam]: Number(value) };
    router.replace(buildRatingPath(level, newRatings));
  };

  return [rating, setRating, RATINGS];
}
